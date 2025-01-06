package main

import (
	"AREA/cmd/reaction_consumer/consts"
	"AREA/cmd/reaction_consumer/github"
	"AREA/cmd/reaction_consumer/spotify"
	"AREA/cmd/reaction_consumer/twitch"
	"AREA/internal/amqp"
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

var service string

var actionCallbacks = map[uint]func(*models.User, map[string]string) {
        9: github.CreateUserRepo,

        31: spotify.PlayPauseTrack,
        32: spotify.SkipPrev,
        33: spotify.SkipNext,
        34: spotify.AddTrack,

        36: twitch.SendMessage,
        37: twitch.WhisperMessage,
}


func handlerAction(message amqp091.Delivery) {
        var workflowEvent models.WorkflowEvent
        err := json.Unmarshal(message.Body, &workflowEvent)
        if err != nil {
                return
        }

        var workflow models.Workflow
        pkg.DB.Where("id = ?", workflowEvent.WorkflowID).First(&workflow)

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

func declareQueues() {
        var services []models.Service
        pkg.DB.Find(&services)
        for _, service := range services {
                amqp.DeclareQueue(utils.GetEnvVar("RMQ_URL"), consts.MessageQueue, service.Name)
        }
}

func main() {
        if len(os.Args) < 2 {
                fmt.Println("Generic service")
                service  = "reaction_queue" //TODO CHANGE WITH DOCKER
        } else {
                service = os.Args[1]
        }
        rabbitMQConnection := utils.GetEnvVar("RMQ_URL")
        pkg.InitDB()
        declareQueues()
        err := amqp.Consumer.Init(rabbitMQConnection, consts.MessageQueue, service)
        if err != nil {
                log.Fatalf("Failed to initialize consumer: %v", err)
        }
        go func() {
                c := make(chan os.Signal, 1)
                signal.Notify(c, os.Interrupt, syscall.SIGTERM)
                <-c
                log.Println("Shutting down consumer...")
                amqp.Consumer.Close()
                os.Exit(0)
        }()

        amqp.Consumer.StartConsuming(consts.MessageQueue, handlerAction)
}
