package amqp

import (
	"fmt"
	"log"

	"github.com/rabbitmq/amqp091-go"
)

var Consumer = &EventConsumer{}

type EventConsumer struct {
        Connection        *Connection
}

func (ec *EventConsumer) Consume(messageQueue []string, handler func(amqp091.Delivery, string)) error {
        for _, queue := range messageQueue {
                fmt.Printf("Consuming on queue %s\n", queue)
                msgs, err := ec.Connection.Channel.Consume(
                        queue,   // Queue name
                        "",             // Consumer tag
                        true,           // Auto-ack
                        false,          // Exclusive
                        false,          // No-local
                        false,          // No-wait
                        nil,            // Arguments
                )
                if err != nil {
                        return fmt.Errorf("failed to start consuming messages: %w", err)
                }

                go func() {
                        for msg := range msgs {
                                fmt.Printf("Received a message on %s: %s\n", queue, msg.Body)
                                handler(msg, queue)
                        }
                }()
        }
        return nil
}

func (ec *EventConsumer) StartConsuming(messageQueue []string, handler func(amqp091.Delivery, string)) {
        forever := make(chan bool)
        err := ec.Consume(messageQueue, handler)
        if err != nil {
                log.Printf("Error consuming messages: %v", err)
                return
        }
        log.Print("Waiting for messages. To exit press CTRL+C")
        <-forever
}
