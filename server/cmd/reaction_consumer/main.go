package main

import (
	"AREA/cmd/reaction_consumer/discord"
	"AREA/cmd/reaction_consumer/github"
	"AREA/cmd/reaction_consumer/google"
	"AREA/cmd/reaction_consumer/microsoft"
	"AREA/cmd/reaction_consumer/spotify"
	"AREA/cmd/reaction_consumer/twitch"
	"AREA/internal/amqp"
	"AREA/internal/gconsts"
	"AREA/internal/models"
	"AREA/internal/pkg"
	"AREA/internal/utils"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/signal"
	"strings"
	"syscall"

	"github.com/rabbitmq/amqp091-go"
)

var actionCallbacks = map[uint]func(*models.User, map[string]string){
        1: discord.SendMessage,

	5: github.CreateUserRepo,

	7:  google.AddEvent,

	16: microsoft.SendEmail,
	17: microsoft.ForwardEmail,
	18: microsoft.SendMessageInChannel,
	19: microsoft.CreateFile,
	20: microsoft.WriteFile,
	21: microsoft.CreateFolder,
	22: microsoft.CreateEvent,
	23: microsoft.SetCustomStatus,

	25: spotify.PlayPauseTrack,
	26: spotify.SkipPrev,
	27: spotify.SkipNext,
	28: spotify.AddTrack,

	30: twitch.SendMessage,
	31: twitch.WhisperMessage,
}

type Parameter struct {
        Name string
        Value string
}

func setupParameters(user *models.User, parameters []Parameter, variables map[string]interface{}) map[string]string {
        parameterMap := make(map[string]string)
        var secrets []models.Secret
        pkg.DB.Table("secrets").Where("user_id = ?", user.ID).Find(&secrets)

        for _, parameter := range parameters {
                tmpValue := parameter.Value
                for _, secret := range secrets {
                        tmpValue = strings.ReplaceAll(tmpValue, fmt.Sprintf("$%s", secret.Key), fmt.Sprintf("%v", secret.Value))
                }
                for key, value := range variables {
			tmpValue = strings.ReplaceAll(tmpValue, fmt.Sprintf("$%s", key), fmt.Sprintf("%v", value))
		}
                parameterMap[parameter.Name] = tmpValue
        }

        return parameterMap
}

type Parameter struct {
        Name string
        Value string
}

func setupParameters(user *models.User, parameters []Parameter, variables map[string]interface{}) map[string]string {
        parameterMap := make(map[string]string)
        var secrets []models.Secret
        pkg.DB.Table("secrets").Where("user_id = ?", user.ID).Find(&secrets)

        for _, parameter := range parameters {
                tmpValue := parameter.Value
                for _, secret := range secrets {
                        tmpValue = strings.ReplaceAll(tmpValue, fmt.Sprintf("$%s", secret.Key), fmt.Sprintf("%v", secret.Value))
                }
                for key, value := range variables {
			tmpValue = strings.ReplaceAll(tmpValue, fmt.Sprintf("$%s", key), fmt.Sprintf("%v", value))
		}
                parameterMap[parameter.Name] = tmpValue
        }

        return parameterMap
}

func executeWorkflowEvent(payload Payload, workflowEvent *models.WorkflowEvent) {
	var user models.User
	pkg.DB.Where("id = ?", payload.Workflow.UserID).First(&user)

	var parameters []Parameter
	pkg.DB.Raw(`
                SELECT
                        parameters.name as name,
                        parameters_values.value as value
                FROM workflow_events
                JOIN parameters_values ON parameters_values.workflow_event_id = workflow_events.id
                JOIN parameters ON parameters.id = parameters_values.parameters_id
                WHERE workflow_events.id = ?`,
		workflowEvent.ID).Scan(&parameters)

	parametersMap := setupParameters(&user, parameters, payload.Args)
        /*for _, parameter := range parameters {
		for key, value := range payload.Args {
			parameter.Value = strings.ReplaceAll(parameter.Value, fmt.Sprintf("$%s", key), fmt.Sprintf("%v", value))
		}
		parametersMap[parameter.Name] = parameter.Value
	}*/
	if callback, ok := actionCallbacks[workflowEvent.EventID]; ok {
		callback(&user, parametersMap)
	} else {
		log.Printf("Callback not found for workflow event id: %d\n", workflowEvent.EventID)
	}
}

func executeWorkflow(payload Payload) {
	rows, err := pkg.DB.Table("workflow_events").Joins("join events on events.id = workflow_events.event_id").Select("workflow_events.*").Where("workflow_events.workflow_id = ? AND events.type = 'reaction'", payload.Workflow.ID).Rows()
	if err != nil {
		return
	}
	defer rows.Close()
	for rows.Next() {
		var workflowEvent models.WorkflowEvent
		pkg.DB.ScanRows(rows, &workflowEvent)
		executeWorkflowEvent(payload, &workflowEvent)
	}
}

type Payload struct {
	Workflow *models.Workflow       `json:"workflow"`
	Args     map[string]interface{} `json:"args"`
}

func handlerAction(message amqp091.Delivery, queue string) {
	var payload Payload

	err := json.Unmarshal(message.Body, &payload)
	if err != nil {
		return
	}
	executeWorkflow(payload)
}

func declareServices() {
	var services []models.Service
	pkg.DB.Find(&services)
	for _, service := range services {
		gconsts.ServiceMap[service.Name] = service.ID
	}
}

func declareQueues() {
	gconsts.Connection.Channel.QueueDeclare("reaction", true, false, false, false, nil)
}

func initRMQConnection() {
	var connection amqp.Connection
	err := connection.Init(utils.GetEnvVar("RMQ_URL"))
	if err != nil {
		log.Fatalf("Failed to initialize connection: %v\n", err)
		return
	}
	gconsts.Connection = &connection
}

func main() {
	pkg.InitDB()
	initRMQConnection()

	declareServices()
	declareQueues()

	consumer := amqp.EventConsumer{Connection: gconsts.Connection}
	go func() {
		c := make(chan os.Signal, 1)
		signal.Notify(c, os.Interrupt, syscall.SIGTERM)
		<-c
		log.Println("Shutting down consumer...")
		gconsts.Connection.Fini()
		os.Exit(0)
	}()
	consumer.StartConsuming([]string{"reaction"}, handlerAction)
}
