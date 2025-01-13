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
	"fmt"
	"time"

	"github.com/rabbitmq/amqp091-go"
)

func sendWorkflow(workflow *models.Workflow) { 
        body, err := json.Marshal(workflow)
        if err != nil {
                return
        }
        gconsts.Connection.Channel.Publish("", "reaction", false, false, amqp091.Publishing{
                ContentType: "application/json",
                Body:        body,
        })
}

var triggerCallbacks = map[uint]func(*models.Workflow, *models.User, map[string]string) bool {
        7: github.PRCreated,
        8: github.UserRepoCreated,

        10: google.EmailReceived,

        27: spotify.StartPlaying,
        32: twitch.StreamStart,
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
        sendWorkflow(workflow) //RESTORE IN IF
        if detectWorkflowEvent(workflow, &user) {
        }
        workflow.LastTrigger = time.Now().Unix()
}
