package controllers

import (
	"AREA/internal/models"
	"AREA/internal/pkg"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/goccy/go-json"
	"net/http"
	"strconv"
)

func SendWorkflowEventsToQueue(workflow models.Workflow) error {
	type WorkflowEventWithDetails struct {
		WorkflowEventID uint
		EventID         uint
		EventName       string
		EventType       string
		ServiceName     string
	}

	var firstActionEvent WorkflowEventWithDetails
	// gorm doesn't support subqueries in the FROM clause, so we have to use a raw query
	query := `
		SELECT workflow_events.id, events.id AS event_id, events.name AS event_name, 
			   events.type AS event_type, services.name AS service_name
		FROM workflow_events
		JOIN events ON events.id = workflow_events.event_id
		JOIN services ON services.id = events.service_id
		WHERE workflow_events.workflow_id = ? AND events.type = ?
		ORDER BY workflow_events.id
		LIMIT 1
	`

	err := pkg.DB.Raw(query, workflow.ID, models.ActionEventType).Scan(&firstActionEvent).Error

	if err != nil {
		return fmt.Errorf("failed to find first action event: %w", err)
	}
	routingKey := fmt.Sprintf("%s.api", firstActionEvent.ServiceName)
	message, err := json.Marshal(workflow.WorkflowEvents)
	if err != nil {
		return fmt.Errorf("failed to serialize workflow events: %w", err)
	}
	if err := pkg.Publisher.Produce(message, routingKey); err != nil {
		return fmt.Errorf("failed to publish message to RabbitMQ: %w", err)
	}

	return nil
}

// WorkflowCreate godoc
// @Summary      Create a workflow
// @Description  Create a new workflow
// @Security     Bearer
// @Tags         workflow
// @Accept       json
// @Produce      json
// @Param        workflow  body  models.WorkflowDTO  true  "workflow"
// @Success      200  {object}  models.WorkflowDTO
// @Failure      400  {object}  map[string]string
// @Router       /workflow/create [post]
func WorkflowCreate(c *gin.Context) {
	var request models.WorkflowCreationRequest
	pkg.PrintRequestJSON(c)
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	userID, err := pkg.GetUserFromToken(c)
	if err != nil {
		c.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}

	workflow := models.Workflow{
		UserID:      userID,
		Name:        request.Name,
		Description: request.Description,
		Status:      models.WorkflowStatusPending,
		IsActive:    true,
	}

	for _, eventReq := range request.Events {
		workflowEvent := models.WorkflowEvent{
			EventID: eventReq.ID,
		}
		for _, param := range eventReq.Parameters {
			parameter := models.Parameters{
				Name:    param.Name,
				Type:    param.Type,
				EventID: eventReq.ID,
			}
			if err := pkg.DB.FirstOrCreate(&parameter, parameter).Error; err != nil {
				c.JSON(500, gin.H{"error": "Failed to create or fetch parameter", "details": err.Error()})
				return
			}
			parameterValue := models.ParametersValue{
				ParametersID: parameter.ID,
				Value:        param.Value,
			}
			workflowEvent.ParametersValues = append(workflowEvent.ParametersValues, parameterValue)
		}
		workflow.WorkflowEvents = append(workflow.WorkflowEvents, workflowEvent)
	}
	if err := pkg.DB.Create(&workflow).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to create workflow", "details": err.Error()})
		return
	}
	if err := SendWorkflowEventsToQueue(workflow); err != nil {
		c.JSON(500, gin.H{"error": "failed to send workflow events: %v", "details": err.Error()})
		return
	}
	c.JSON(200, gin.H{"workflow": workflow})
}

// WorkflowList godoc
// @Summary      List workflows
// @Description  List all workflows
// @Security     Bearer
// @Tags         workflow
// @Accept       json
// @Produce      json
// @Success      200  {object}  []models.WorkflowDTO
// @Router       /workflow/list [get]
func WorkflowList(c *gin.Context) {
	var workflows []models.Workflow
	userID, err := pkg.GetUserFromToken(c)
	if err != nil {
		return
	}
	err = pkg.DB.Preload("WorkflowEvents.ParametersValues").
		Where("user_id = ?", userID).
		Find(&workflows).Error

	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to fetch workflows"})
		return
	}
	c.JSON(200, gin.H{"workflows": workflows})
}

// WorkflowDelete godoc
// @Summary      Delete a workflow
// @Description  Delete a workflow by ID
// @Security     Bearer
// @Tags         workflow
// @Accept       json
// @Produce      json
// @Param        id  path  int  true  "workflow ID"
// @Success      200  {object}  map[string]string
// @Failure      400  {object}  map[string]string
// @Failure      404  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /workflow/delete/{id} [delete]
func WorkflowDelete(c *gin.Context) {
	idParam := c.Param("id")
	workflowID, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid workflow ID"})
		return
	}
	var workflow models.Workflow
	result := pkg.DB.First(&workflow, workflowID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Workflow not found"})
		return
	}
	result = pkg.DB.Delete(&workflow)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete workflow"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Workflow deleted successfully"})
}
