package trigger

import (
	"AREA/cmd/action_consumer/twitch"
	"AREA/cmd/action_consumer/vars"
	"AREA/internal/models"
	"AREA/internal/pkg"
	"AREA/internal/utils"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"gorm.io/gorm"
)

func sendEvents(workflow *models.Workflow) {
        rows, err := pkg.DB.Raw(`
                SELECT
                        workflow_events.id AS workflow_event_id,
                        events.id AS event_id,
                        services.id AS service_id,
                        services.name AS service_name
                FROM workflow_events
                JOIN events ON events.id = workflow_events.event_id
                JOIN services ON services.id = events.service_id
                WHERE workflow_events.workflow_id = ? AND events.type = 'reaction'
                `, workflow.ID).Rows()
        if err != nil {
                return
        }

        var reaction struct {
                WorkflowEventID uint
                EventID         uint
                ServiceID       uint
                ServiceName     string
        }
        defer rows.Close()
        for rows.Next() {
                var workflowEvent models.WorkflowEvent
                pkg.DB.ScanRows(rows, &reaction)
                err := pkg.DB.Where("id = ?", reaction.WorkflowEventID).First(&workflowEvent).Error
                if errors.Is(err, gorm.ErrRecordNotFound) {
                        fmt.Println("NOT FOUND")
                        continue
                }
                producer := utils.RMQProducer{
                        Queue: reaction.ServiceName,
                        ConnectionString: utils.GetEnvVar("RMQ_URL"),
                }
                body, _ := json.Marshal(workflowEvent)
                producer.PublishMessage("json", body)
        }
}

var triggerCallbacks = map[uint]func(*models.User, []string) bool {
                33: twitch.StreamStart,
}

func triggerCallback(workflowEventId uint, refEventId uint, user *models.User) bool {
        var parameters []string
        pkg.DB.Raw(`
                SELECT
                        parameters_values.value
                FROM workflow_events
                JOIN parameters_values ON parameters_values.workflow_event_id = workflow_events.id
                WHERE workflow_events.id = ?`,
                workflowEventId).Scan(&parameters)
        
        if callback, ok := triggerCallbacks[refEventId]; ok {
                return callback(user, parameters)
        } else {
                fmt.Printf("Callback not found for workflow event id: %d\n", refEventId)
        }
        return false
}

func detectWorkflowEvent(workflow *models.Workflow, user *models.User) bool {
        var event struct {
                ID              uint
                RefEventID      uint
        }

        rows, err := pkg.DB.Raw(`
                SELECT
                        workflow_events.id AS id,
                        events.id AS ref_event_id
                FROM workflow_events
                JOIN events ON events.id = workflow_events.event_id
                WHERE workflow_events.workflow_id = ? AND events.type = 'action'
                `, workflow.ID) .Rows()
        if err != nil {
                return false
        }
        defer rows.Close()
        for rows.Next() {
                pkg.DB.ScanRows(rows, &event)
                if triggerCallback(event.ID, event.RefEventID, user) {
                        return true
                }
        }
        return false
}

func DetectWorkflowsEvent(serviceName string) {
        var user models.User
        var workflow models.Workflow

        rows, err := pkg.DB.Table("workflows").Rows()
        if err != nil {
                return
        }
        defer rows.Close()
        for rows.Next() {
                pkg.DB.ScanRows(rows, &workflow)
                pkg.DB.Where("id = ?", workflow.UserID).First(&user)
                if detectWorkflowEvent(&workflow, &user) {
                        sendEvents(&workflow)
                }
        }

        vars.LastFetch = time.Now()
}
