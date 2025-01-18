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
	"strings"
	"time"
)

var triggerCallbacks = map[uint]func(*models.Workflow, *models.User, map[string]string) (bool, []interface{}, error){
        2: github.CommitCreated,
        3: github.PRCreated,
	4: github.UserRepoCreated,

	6: google.EmailReceived,

	8: microsoft.MailReceived,
	9: microsoft.NewChannelCreated,
	10: microsoft.MeetingJoined,
	11: microsoft.DriveFileAdded,
	12: microsoft.DriveFileModified,
	13: microsoft.CalendarEventStarted,
	14: microsoft.CalendarEventCreated,
	15: microsoft.ChangePresence,

        24: spotify.StartPlaying,

	27: twitch.StreamStart,
}

type Parameter struct {
        Name string
        Value string
}

func setupParameters(user *models.User, parameters []Parameter) map[string]string {
        parameterMap := make(map[string]string)
        var secrets []models.Secret
        pkg.DB.Table("secrets").Where("user_id = ?", user.ID).Find(&secrets)

        for _, parameter := range parameters {
                tmpValue := parameter.Value
                for _, secret := range secrets {
                        tmpValue = strings.ReplaceAll(tmpValue, secret.Key, secret.Value)
                }
                parameterMap[parameter.Name] = tmpValue
        }
        return parameterMap
}

func callCallback(workflow *models.Workflow, workflowEventId uint, refEventId uint, user *models.User) (bool, []interface{}, error) {
	var parameters []Parameter
	pkg.DB.Raw(`
                SELECT
                        parameters.name AS name,
                        parameters_values.value AS value
                FROM workflow_events
                JOIN parameters_values ON parameters_values.workflow_event_id = workflow_events.id
                JOIN parameters ON parameters.id = parameters_values.parameters_id
                WHERE workflow_events.id = ?`,
		workflowEventId).Scan(&parameters)

	parametersMap := setupParameters(user, parameters)
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
