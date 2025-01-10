package main

import (
	"AREA/cmd/action_consumer/trigger"
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

func handlerAction(message amqp091.Delivery, queue string) {
        var workflow models.Workflow

        err := json.Unmarshal(message.Body, &workflow)
        if err != nil {
                return
        }
        trigger.DetectWorkflowsEvent(&workflow)
        pkg.DB.Save(workflow)
}

func declareServices() {
        var services []models.Service
        pkg.DB.Find(&services)
        for _, service := range services {
                gconsts.ServiceMap[service.Name] = service.ID
        }
}

func declareQueues() {
        gconsts.Connection.Channel.QueueDeclare("action", true, false, false, false, nil)
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

        declareServices()
        declareQueues()
        fmt.Println(gconsts.ServiceMap)

        consumer := amqp.EventConsumer{Connection: gconsts.Connection}
        go func() {
                c := make(chan os.Signal, 1)
                signal.Notify(c, os.Interrupt, syscall.SIGTERM)
                <-c
                log.Println("Shutting down consumer...")
                gconsts.Connection.Fini()
                os.Exit(0)
        }()
        consumer.StartConsuming([]string{"action"}, handlerAction)
}
