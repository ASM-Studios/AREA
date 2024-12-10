package handlers

import (
	"fmt"
	"log"
	"service/microsoft"
	"service/models"
	"service/utils"
)

func GetWorkflowAndToken(workflowEventID uint) (*models.Workflow, *models.User, *models.Event, string, error) {
	type Result struct {
		WorkflowID     uint
		WorkflowName   string
		UserID         uint
		UserEmail      string
		MicrosoftToken string
		EventID        uint
		EventName      string
		EventType      string
	}

	query := `
        SELECT 
            workflows.id AS workflow_id,
            workflows.name AS workflow_name,
            users.id AS user_id,
            users.email AS user_email,
            tokens.value AS microsoft_token,
            events.id AS event_id,
            events.name AS event_name,
            events.type AS event_type
        FROM 
            workflow_events
        JOIN 
            workflows ON workflows.id = workflow_events.workflow_id
        JOIN 
            users ON users.id = workflows.user_id
        JOIN 
            tokens ON tokens.user_id = users.id
        JOIN 
            services ON services.id = tokens.service_id
        JOIN
            events ON events.id = workflow_events.event_id
        WHERE 
            workflow_events.id = ? AND services.name = 'microsoft'
        LIMIT 1
    `

	var result Result
	err := utils.DB.Raw(query, workflowEventID).Scan(&result).Error
	if err != nil {
		return nil, nil, nil, "", fmt.Errorf("failed to retrieve data: %w", err)
	}

	var workflow models.Workflow
	var user models.User
	var event models.Event

	if err := utils.DB.First(&workflow, result.WorkflowID).Error; err != nil {
		return nil, nil, nil, "", err
	}
	if err := utils.DB.First(&user, result.UserID).Error; err != nil {
		return nil, nil, nil, "", err
	}
	if err := utils.DB.First(&event, result.EventID).Error; err != nil {
		return nil, nil, nil, "", err
	}

	return &workflow, &user, &event, result.MicrosoftToken, nil
}

func HandleWorkflowEvent(workflowEvent models.WorkflowEvent) {
	log.Printf("Processing workflow event: %+v", workflowEvent)

	var tmpWorkflow models.Workflow
	if err := utils.DB.First(&tmpWorkflow, workflowEvent.WorkflowID).Error; err != nil {
		log.Printf("Workflow not found for WorkflowID: %d", workflowEvent.WorkflowID)
		return
	}

	workflow, user, event, microsoftToken, err := GetWorkflowAndToken(workflowEvent.ID)
	if err != nil {
		log.Printf("Failed to fetch workflow, user, or token: %v", err)
		return
	}

	log.Printf("Fetched Workflow: %s (ID: %d), User: %s (ID: %d), Event: %s (%s), Microsoft Token: %s",
		workflow.Name, workflow.ID, user.Email, user.ID, event.Name, event.Type, microsoftToken)

	microsoftAPI, err := microsoft.InitMicrosoftAPI(microsoftToken)
	if err != nil {
		log.Printf("Failed to initialize Microsoft API: %v", err)
		return
	}

	err = microsoftAPI.ProcessWorkflowEvent(workflow.ID, workflowEvent.EventID)
	if err != nil {
		log.Printf("Failed to process workflow event: %v", err)
		return
	}

	log.Printf("Successfully processed workflow event: %+v", workflowEvent)
}
