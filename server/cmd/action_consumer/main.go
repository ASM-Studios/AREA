package main

import (
	"AREA/cmd/action_consumer/consts"
	"AREA/cmd/action_consumer/trigger"
	"AREA/cmd/action_consumer/vars"
	"AREA/internal/amqp"
	"AREA/internal/models"
	"AREA/internal/pkg"
	"AREA/internal/utils"
	"bytes"
	"errors"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/rabbitmq/amqp091-go"
	"gorm.io/gorm"
)

var service string

func handlerAction(message amqp091.Delivery) {
        if bytes.Equal(message.Body, []byte("trigger")) {
                trigger.DetectWorkflowsEvent(service)
        }
}

func setService() {
        if len(os.Args) < 2 {
                return
        }
        service = os.Args[1]
        var service models.Service
        err := pkg.DB.Where("name = ?", service).First(&service).Error
        if errors.Is(err, gorm.ErrRecordNotFound) {
                return
        }
        vars.ServiceId = fmt.Sprintf("%d", service.ID)
}

func main() {
        rabbitMQConnection := utils.GetEnvVar("RMQ_URL")
        pkg.InitDB()
        setService()
        fmt.Printf("Service: %s\n", vars.ServiceId)
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
