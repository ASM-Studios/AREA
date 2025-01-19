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
    if err := c.ShouldBindJSON(&request); err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }
    user, err := pkg.GetUserFromToken(c)
    if err != nil {
        c.JSON(401, gin.H{"error": "Unauthorized"})
        return
    }
    
    workflow := models.Workflow{
        UserID:      user.ID,
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
    user, err := pkg.GetUserFromToken(c)
    if err != nil {
        return
    }
    err = pkg.DB.Preload("WorkflowEvents.ParametersValues").
        Where("user_id = ?", user.ID).
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
    result := pkg.DB.Preload("WorkflowEvents.ParametersValues").First(&workflow, workflowID)
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Workflow not found"})
        return
    }
    for _, event := range workflow.WorkflowEvents {
        pkg.DB.Delete(&event.ParametersValues)
        pkg.DB.Delete(&event)
    }
    result = pkg.DB.Unscoped().Delete(&workflow)
    
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete workflow"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "Workflow deleted successfully"})
}

// WorkflowGet retrieves a specific workflow by its ID.
// @Summary Get a workflow by ID
// @Description Retrieve detailed information about a workflow, including its events and parameters.
// @Tags workflow
// @Param id path int true "Workflow ID"
// @Produce json
// @Success 200 {object} map[string]interface{} "workflow details"
// @Failure 400 {object} map[string]interface{} "Invalid workflow ID or bad request"
// @Failure 404 {object} map[string]interface{} "Workflow not found"
// @Router /workflows/{id} [get]
func WorkflowGet(c *gin.Context) {
    idParam := c.Param("id")
    workflowID, err := strconv.Atoi(idParam)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid workflow ID"})
        return
    }
    var workflow models.Workflow
    if pkg.DB.Preload("WorkflowEvents.ParametersValues").First(&workflow, workflowID).Error != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid workflow ID"})
        return
    }
    var events []models.EventRequest
    var services []uint
    for _, ev := range workflow.WorkflowEvents {
        var event models.Event
        pkg.DB.First(&event, ev.EventID)
        eventData := models.EventRequest{
            Id:          event.ID,
            Name:        event.Name,
            Description: event.Description,
            Type:        event.Type,
        }
        services = addUniqueService(services, event.ServiceID)
        var paramsData []models.ParametersRequest
        for _, param := range ev.ParametersValues {
            var parameter models.Parameters
            pkg.DB.First(&parameter, param.ParametersID)
            paramData := models.ParametersRequest{
                Name:  parameter.Name,
                Type:  parameter.Type,
                Value: &param.Value,
            }
            paramsData = append(paramsData, paramData)
        }
        eventData.Parameters = &paramsData
        events = append(events, eventData)
    }
    
    var workflowData = models.WorkflowRequest{
        Name:        &workflow.Name,
        Description: &workflow.Description,
        Services:    &services,
        Events:      &events,
        IsActive:    &workflow.IsActive,
    }
    c.JSON(http.StatusOK, gin.H{"workflow": workflowData})
}

func addUniqueService(services []uint, serviceID uint) []uint {
    for _, id := range services {
        if id == serviceID {
            return services
        }
    }
    return append(services, serviceID)
}

// WorkflowUpdate updates a workflow's details.
// @Summary Update a workflow
// @Description Update the description, name, is_active status, and parameter values of a workflow.
// @Tags workflow
// @Param id path int true "Workflow ID"
// @Param body body models.WorkflowRequest true "Workflow update request"
// @Produce json
// @Success 200 {object} map[string]interface{} "Workflow updated successfully"
// @Failure 400 {object} map[string]interface{} "Invalid workflow ID or bad request"
// @Failure 404 {object} map[string]interface{} "Workflow or parameter value not found"
// @Failure 500 {object} map[string]interface{} "Internal server error"
// @Router /workflows/{id} [put]
func WorkflowUpdate(c *gin.Context) {
    idParam := c.Param("id")
    workflowID, err := strconv.Atoi(idParam)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid workflow ID"})
        return
    }
    var workflow models.Workflow
    if err := pkg.DB.Preload("WorkflowEvents.ParametersValues").First(&workflow, workflowID).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Workflow not found"})
        return
    }
    var request models.WorkflowRequest
    if err := c.ShouldBindJSON(&request); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format", "details": err.Error()})
        return
    }
    if request.Description != nil {
        workflow.Description = *request.Description
    }
    if request.Name != nil {
        workflow.Name = *request.Name
    }
    if request.IsActive != nil {
        workflow.IsActive = *request.IsActive
    }
    if request.Events != nil {
        for _, eventReq := range *request.Events {
            if eventReq.Parameters == nil {
                continue
            }
            for _, paramReq := range *eventReq.Parameters {
                var parameterValue models.ParametersValue
                if err := pkg.DB.
                    Joins("JOIN parameters ON parameters.id = parameters_values.parameters_id").
                    Where("parameters.event_id = ? AND parameters.name = ?", eventReq.Id, paramReq.Name).
                    First(&parameterValue).Error; err != nil {
                    c.JSON(http.StatusNotFound, gin.H{"error": "Parameter value not found", "details": err.Error()})
                    return
                }
                if paramReq.Value != nil {
                    parameterValue.Value = *paramReq.Value
                    if err := pkg.DB.Save(&parameterValue).Error; err != nil {
                        c.JSON(500, gin.H{"error": "Failed to update parameter value", "details": err.Error()})
                        return
                    }
                }
            }
        }
    }
    if err := pkg.DB.Save(&workflow).Error; err != nil {
        c.JSON(500, gin.H{"error": "Failed to update workflow", "details": err.Error()})
        return
    }
    c.JSON(http.StatusOK, gin.H{"workflow": workflow})
}
