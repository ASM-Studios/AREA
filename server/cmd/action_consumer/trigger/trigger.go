package trigger

import (
	"AREA/cmd/action_consumer/github"
	"AREA/cmd/action_consumer/google"
	"AREA/cmd/action_consumer/spotify"
	"AREA/cmd/action_consumer/twitch"
	"AREA/internal/gconsts"
	"AREA/internal/models"
	"AREA/internal/pkg"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/rabbitmq/amqp091-go"
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
                body, _ := json.Marshal(workflowEvent)
                gconsts.Connection.Channel.Publish("", fmt.Sprintf("reaction.%s", reaction.ServiceName), false, false, amqp091.Publishing{
                        ContentType: "application/json",
                        Body:        body,
                })
        }
}

var triggerCallbacks = map[uint]func(*models.Workflow, *models.User, map[string]string) bool {
        7: github.PRCreated,
        8: github.UserRepoCreated,

        10: google.EmailReceived,

        30: spotify.StartPlaying,
        35: twitch.StreamStart,
}

func triggerCallback(workflow *models.Workflow, workflowEventId uint, refEventId uint, user *models.User) bool {
        var parameters []struct {
                Name    string
                Value   string
        }
        pkg.DB.Raw(`
                SELECT
                        parameters.name AS name,
                        parameters_values.value AS value
                FROM workflow_events
                JOIN parameters_values ON parameters_values.workflow_event_id = workflow_events.id
                JOIN parameters ON parameters.id = parameters_values.parameters_id
                WHERE workflow_events.id = ?`,
                workflowEventId).Scan(&parameters)

        parametersMap := make(map[string]string)
        for _, parameter := range parameters {
                parametersMap[parameter.Name] = parameter.Value
        }

        if callback, ok := triggerCallbacks[refEventId]; ok {
                return callback(workflow, user, parametersMap)
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

        query := `SELECT
                        workflow_events.id AS id,
                        events.id AS ref_event_id
                FROM workflow_events
                JOIN events ON events.id = workflow_events.event_id
                JOIN services ON services.id = events.service_id
                WHERE workflow_events.workflow_id = ? AND events.type = 'action'`

        rows, err := pkg.DB.Raw(query, workflow.ID) .Rows()
        if err != nil {
                return false
        }
        defer rows.Close()
        for rows.Next() {
                pkg.DB.ScanRows(rows, &event)
                if triggerCallback(workflow, event.ID, event.RefEventID, user) {
                        return true
                }
        }
        return false
}

func DetectWorkflowsEvent(workflow *models.Workflow) {
        var user models.User

        pkg.DB.Where("id = ?", workflow.UserID).First(&user)
        if detectWorkflowEvent(workflow, &user) {
                sendEvents(workflow)
        }
        workflow.LastTrigger = time.Now().Unix()
}
