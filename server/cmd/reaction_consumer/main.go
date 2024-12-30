package main

import (
	"AREA/cmd/reaction_consumer/twitch"
	"AREA/cmd/reaction_consumer/consts"
	"AREA/internal/amqp"
	"AREA/internal/models"
	"AREA/internal/pkg"
	"AREA/internal/utils"
	"encoding/json"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/rabbitmq/amqp091-go"
)

var service string

var actionCallbacks = map[uint]func(*models.User, []string) {
        31: twitch.SendMessage,
        32: twitch.WhisperMessage,
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

        var parameters []string
        pkg.DB.Raw(`
                SELECT
                        parameters_values.value
                FROM workflow_events
                JOIN parameters_values ON parameters_values.workflow_event_id = workflow_events.id
                WHERE workflow_events.id = ?`,
                workflowEvent.ID).Scan(&parameters)

        if callback, ok := actionCallbacks[workflowEvent.EventID]; ok {
                callback(&user, parameters)
        } else {
                log.Printf("Callback not found for workflow event id: %d\n", workflowEvent.EventID)
        }
}

func main() {
        if len(os.Args) < 2 {
                service  = "twitch" //TODO CHANGE WITH DOCKER
        } else {
                service = os.Args[1]
        }
        rabbitMQConnection := utils.GetEnvVar("RMQ_URL")
        pkg.InitDB()
        err := amqp.Consumer.Init(rabbitMQConnection, consts.MessageQueue, consts.Key)
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
