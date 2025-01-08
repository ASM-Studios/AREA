package main

import (
	"AREA/cmd/action_consumer/trigger"
	"AREA/internal/amqp"
	"AREA/internal/gconsts"
	"AREA/internal/pkg"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/rabbitmq/amqp091-go"
)

func handlerAction(message amqp091.Delivery, queue string) {
        trigger.DetectWorkflowsEvent()
}

func declareExchanges() error {
        err := gconsts.Connection.Channel.ExchangeDeclare("action", "topic", true, false, false, false, nil)
        if err != nil {
                return err
        }
        return nil
}

func declareQueues() {
        gconsts.Connection.Channel.QueueDeclare("trigger", true, false, false, false, nil)
        gconsts.Connection.Channel.QueueBind("trigger", "trigger", "action", false, nil)
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

        consumer := amqp.EventConsumer{Connection: gconsts.Connection}
        go func() {
                c := make(chan os.Signal, 1)
                signal.Notify(c, os.Interrupt, syscall.SIGTERM)
                <-c
                log.Println("Shutting down consumer...")
                gconsts.Connection.Fini()
                os.Exit(0)
        }()
        consumer.StartConsuming([]string{"trigger"}, handlerAction)
}
