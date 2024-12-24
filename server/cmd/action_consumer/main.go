package main

import (
	"AREA/cmd/action_consumer/consts"
	"AREA/cmd/action_consumer/trigger"
	"AREA/internal/amqp"
	"AREA/internal/pkg"
	"AREA/internal/utils"
	"bytes"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/rabbitmq/amqp091-go"
)

var service string

func handlerAction(message amqp091.Delivery) {
        if bytes.Equal(message.Body, []byte("trigger")) {
                trigger.DetectWorkflowsEvent(service)
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
