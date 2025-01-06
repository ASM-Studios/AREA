package main

import (
	"AREA/cmd/action_consumer/trigger"
	"AREA/internal/amqp"
	"AREA/internal/gconsts"
	"AREA/internal/models"
	"AREA/internal/pkg"
	"bytes"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/rabbitmq/amqp091-go"
)

func handlerAction(message amqp091.Delivery, queue string) {
        var service string
        fmt.Sscanf(queue, "action.%s", &service)
        if bytes.Equal(message.Body, []byte("trigger")) {
                trigger.DetectWorkflowsEvent(service)
        }
}

func declareExchanges(connection *amqp.Connection) error {
        err := connection.Channel.ExchangeDeclare("action", "fanout", true, false, false, false, nil)
        if err != nil {
                return err
        }
        err = connection.Channel.ExchangeDeclare("reaction", "topic", true, false, false, false, nil)
        if err != nil {
                return err
        }
        return nil
}

func declareQueues(connection *amqp.Connection) {
        var services []models.Service
        pkg.DB.Find(&services)
        for _, service := range services {
                queueName := fmt.Sprintf("action.%s", service.Name)
                routingKey := fmt.Sprintf("action.%s", service.Name)
                connection.Channel.QueueDeclare(queueName, true, false, false, false, nil)
                connection.Channel.QueueBind(queueName, routingKey, "action", false, nil)
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
        return services
}

func initRMQConnection() {
        var connection amqp.Connection
        err := connection.Init("amqp://guest:guest@localhost:5672")
        if err != nil {
                log.Fatalf("Failed to initialize connection: %v", err)
                return
        }
        gconsts.Connection = &connection
}

func main() {
        pkg.InitDB()
        initRMQConnection()

        declareExchanges(gconsts.Connection)
        declareQueues(gconsts.Connection)

        services := getServices()

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
