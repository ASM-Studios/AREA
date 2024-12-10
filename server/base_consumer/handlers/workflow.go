package handlers

import (
	"fmt"
	"log"
	"service/models"
	"service/utils"
)

func GetWorkflowAndToken(workflowEventID uint) (*models.Workflow, *models.User, string, error) {
	type Result struct {
		WorkflowID     uint
		WorkflowName   string
		UserID         uint
		UserEmail      string
		MicrosoftToken string
	}

	var result Result

	query := `
		SELECT 
			workflows.id AS workflow_id,
			workflows.name AS workflow_name,
			users.id AS user_id,
			users.email AS user_email,
			tokens.value AS microsoft_token
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
		WHERE 
			workflow_events.id = ? AND services.name = 'microsoft'
		LIMIT 1
	`

	err := utils.DB.Raw(query, workflowEventID).Scan(&result).Error
	if err != nil {
		return nil, nil, "", fmt.Errorf("failed to retrieve data: %w", err)
	}

	var workflow = &models.Workflow{}
	var user = &models.User{}
	utils.DB.First(workflow, result.WorkflowID)
	utils.DB.First(user, result.UserID)

	return workflow, user, result.MicrosoftToken, nil
}

func HandleWorkflowEvent(workflowEvent models.WorkflowEvent) {
	log.Printf("Processing workflow event: %+v", workflowEvent)

	var tmpWorkflow models.Workflow
	err := utils.DB.First(&tmpWorkflow, workflowEvent.WorkflowID).Error
	if err != nil {
		log.Printf("Workflow not found for WorkflowID: %d", workflowEvent.WorkflowID)
		return
	}
	workflow, user, microsoftToken, err := GetWorkflowAndToken(workflowEvent.ID)
	if err != nil {
		log.Printf("Failed to fetch workflow, user, or token: %v", err)
		return
	}

	log.Printf("Fetched Workflow: %s (ID: %d), User: %s (ID: %d), Microsoft Token: %s",
		workflow.Name, workflow.ID, user.Email, microsoftToken)
	microsoftAPI, err := utils.InitMicrosoftAPI(microsoftToken)
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
