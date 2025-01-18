package trigger

import (
	"AREA/cmd/action_consumer/github"
	"AREA/cmd/action_consumer/google"
	"AREA/cmd/action_consumer/microsoft"
	"AREA/cmd/action_consumer/spotify"
	"AREA/cmd/action_consumer/twitch"
	"AREA/internal/models"
	"AREA/internal/pkg"
	"errors"
	"fmt"
	"reflect"
	"time"
)

var triggerCallbacks = map[uint]func(*models.Workflow, *models.User, map[string]string) (bool, []interface{}, error){
	2: github.PRCreated,
	3: github.UserRepoCreated,

	5: google.EmailReceived,

	7:  microsoft.MailReceived,
	8:  microsoft.NewChannelCreated,
	9:  microsoft.DriveFileAdded,
	10:  microsoft.DriveFileModified,
	11: microsoft.CalendarEventStarted,
	12: microsoft.CalendarEventCreated,

        21: spotify.StartPlaying,

	27: twitch.StreamStart,
}

func callCallback(workflow *models.Workflow, workflowEventId uint, refEventId uint, user *models.User) (bool, []interface{}, error) {
	var parameters []struct {
		Name  string
		Value string
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
		return false, nil, errors.New("Callback not implemented")
	}
}

type Event struct {
	ID           uint
	RefEventID   uint
	RefEventName string
	ServiceName  string
}

func uploadPayload(event Event, index int, result interface{}) map[string]interface{} {
	reactionArgs := make(map[string]interface{})
	t := reflect.TypeOf(result)
	v := reflect.ValueOf(result)

	for i := 0; i < t.NumField(); i++ {
		field := t.Field(i)
		value := v.Field(i)
		reactionArgs[fmt.Sprintf("%s.%s.%d", event.RefEventName, field.Tag.Get("json"), index)] = fmt.Sprintf("%v", value)
	}
	return reactionArgs
}

func detectWorkflowEvent(workflow *models.Workflow, user *models.User) {
	var event Event

	query := `SELECT
                        workflow_events.id AS id,
                        events.id AS ref_event_id,
                        events.short_name as ref_event_name,
                        services.name AS service_name
                FROM workflow_events
                JOIN events ON events.id = workflow_events.event_id
                JOIN services ON services.id = events.service_id
                WHERE workflow_events.workflow_id = ? AND events.type = 'action'`

	rows, err := pkg.DB.Raw(query, workflow.ID).Rows()
	if err != nil {
		return
	}
	defer rows.Close()
	var i int = 0
	for rows.Next() {
		pkg.DB.ScanRows(rows, &event)
		result, body, err := callCallback(workflow, event.ID, event.RefEventID, user)
		if err != nil {
			continue
		}
		if result == false {
			continue
		}
		for _, payload := range body {
			reactionArgs := uploadPayload(event, i, payload)
			sendWorkflow(workflow, reactionArgs)
		}
		i += 1
	}
	return
}

func DetectWorkflowsEvent(workflow *models.Workflow) {
	var user models.User
	err := pkg.DB.Where("id = ?", workflow.UserID).First(&user).Error
	if err != nil {
		return
	}

	detectWorkflowEvent(workflow, &user)
	workflow.LastTrigger = time.Now().Unix()
}
