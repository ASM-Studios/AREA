package main

import (
	"AREA/cmd/reaction_consumer/github"
	"AREA/cmd/reaction_consumer/google"
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
	"syscall"

	"github.com/rabbitmq/amqp091-go"
)

var actionCallbacks = map[uint]func(*models.User, map[string]string) {
        9: github.CreateUserRepo,

        11: google.AddEvent,

        28: spotify.PlayPauseTrack,
        29: spotify.SkipPrev,
        30: spotify.SkipNext,
        31: spotify.AddTrack,

        33: twitch.SendMessage,
        34: twitch.WhisperMessage,
}

func executeWorkflowEvent(workflow *models.Workflow, workflowEvent *models.WorkflowEvent) {
        fmt.Printf("Executing workflow event id: %d\n", workflowEvent.ID)
        var user models.User
        pkg.DB.Where("id = ?", workflow.UserID).First(&user)

        var parameters []struct {
                Name    string
                Value   string
        }
        pkg.DB.Raw(`
                SELECT
                        parameters.name as name,
                        parameters_values.value as value
                FROM workflow_events
                JOIN parameters_values ON parameters_values.workflow_event_id = workflow_events.id
                JOIN parameters ON parameters.id = parameters_values.parameters_id
                WHERE workflow_events.id = ?`,
                workflowEvent.ID).Scan(&parameters)

        parametersMap := make(map[string]string)
        for _, parameter := range parameters {
                parametersMap[parameter.Name] = parameter.Value
        }
        if callback, ok := actionCallbacks[workflowEvent.EventID]; ok {
                callback(&user, parametersMap)
        } else {
                log.Printf("Callback not found for workflow event id: %d\n", workflowEvent.EventID)
        }
}

func executeWorkflow(workflow *models.Workflow) {
        rows, err := pkg.DB.Table("workflow_events").Joins("join events on events.id = workflow_events.event_id").Select("workflow_events.*").Where("workflow_events.workflow_id = ? AND events.type = 'reaction'", workflow.ID).Rows()
        if err != nil {
                return
        }
        defer rows.Close()
        for rows.Next() {
                var workflowEvent models.WorkflowEvent
                pkg.DB.ScanRows(rows, &workflowEvent)
                executeWorkflowEvent(workflow, &workflowEvent)
        }
}



func handlerAction(message amqp091.Delivery, queue string) {
        var workflow models.Workflow

        err := json.Unmarshal(message.Body, &workflow)
        if err != nil {
                return
        }
        executeWorkflow(&workflow)
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
