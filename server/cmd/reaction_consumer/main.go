package main

import (
	"AREA/cmd/reaction_consumer/github"
	"AREA/cmd/reaction_consumer/spotify"
	"AREA/cmd/reaction_consumer/twitch"
	"AREA/internal/amqp"
	"AREA/internal/gconsts"
	"AREA/internal/models"
	"AREA/internal/pkg"
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

        31: spotify.PlayPauseTrack,
        32: spotify.SkipPrev,
        33: spotify.SkipNext,
        34: spotify.AddTrack,

        36: twitch.SendMessage,
        37: twitch.WhisperMessage,
}

func executeWorkflowEvent(message amqp091.Delivery, service string) {
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

func handlerAction(message amqp091.Delivery, queue string) {
        var service string
        fmt.Sscanf(queue, "reaction.%s", &service)
        executeWorkflowEvent(message, service)
}

func declareExchanges() error {
        err := gconsts.Connection.Channel.ExchangeDeclare("reaction", "topic", true, false, false, false, nil)
        if err != nil {
                return err
        }
        return nil
}

func declareQueues() {
        var services []models.Service
        pkg.DB.Find(&services)
        for _, service := range services {
                queueName := fmt.Sprintf("reaction.%s", service.Name)
                routingKey := fmt.Sprintf("reaction.%s", service.Name)
                gconsts.Connection.Channel.QueueDeclare(queueName, true, false, false, false, nil)
                gconsts.Connection.Channel.QueueBind(queueName, routingKey, "reaction", false, nil)
        }
}

func getServices() []string {
        var services []string
        if len(os.Args) < 2 {
                pkg.DB.Raw("SELECT name FROM services").Scan(&services)
        } else {
                for _, arg := range os.Args[1:] {
                        services = append(services, arg)
                }
        }
        for i, service := range services {
                services[i] = fmt.Sprintf("reaction.%s", service)
        }
        return services
}

func initRMQConnection() {
        var connection amqp.Connection
        err := connection.Init("amqp://guest:guest@localhost:5672")
        if err != nil {
                log.Fatalf("Failed to initialize connection: %v\n", err)
                return
        }
        gconsts.Connection = &connection
}

func main() {
        pkg.InitDB()
        initRMQConnection()

        declareExchanges()
        declareQueues()

        services := getServices()
        fmt.Printf("Looking on %v\n", services)

        consumer := amqp.EventConsumer{Connection: gconsts.Connection}
        go func() {
                c := make(chan os.Signal, 1)
                signal.Notify(c, os.Interrupt, syscall.SIGTERM)
                <-c
                log.Println("Shutting down consumer...")
                gconsts.Connection.Fini()
                os.Exit(0)
        }()
        consumer.StartConsuming(services, handlerAction)
}
