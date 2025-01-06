package amqp

import (
	"AREA/internal/gconsts"
	"fmt"
	"log"

	"github.com/rabbitmq/amqp091-go"
)

var Consumer = &EventConsumer{}

type EventConsumer struct {
        connection *amqp091.Connection
        channel    *amqp091.Channel
}

func DeclareQueue(rabbitMQConnection string, messageQueue string, key string) error {
        conn, err := amqp091.Dial(rabbitMQConnection)
        if err != nil {
                return fmt.Errorf("failed to connect to RabbitMQ: %w", err)
        }
        ch, err := conn.Channel()
        if err != nil {
                return fmt.Errorf("failed to open")
        }
        ch.QueueDeclare(
                messageQueue,   // Queue name
                true,           // Durable
                false,          // Delete when unused
                false,          // Exclusive
                false,          // No-wait
                nil,            // Arguments
        )
        ch.QueueBind(
                messageQueue,   // Queue name
                key,            // Routing key
                gconsts.ExchangeName,   // Exchange name
                false,          // No-wait
                nil,            // Arguments
        )
        return nil
}

func (ec *EventConsumer) Consume(messageQueue string, handler func(amqp091.Delivery)) error {
        msgs, err := ec.channel.Consume(
                messageQueue, // Queue name
                "",                  // Consumer tag
                true,                // Auto-ack
                false,               // Exclusive
                false,               // No-local
                false,               // No-wait
                nil,                 // Arguments
        )
        if err != nil {
                return fmt.Errorf("failed to start consuming messages: %w", err)
        }

        go func() {
                for msg := range msgs {
                        fmt.Printf("Received a message: %s\n", msg.Body)
                        handler(msg)
                }
        }()
        return nil
}

func (ec *EventConsumer) StartConsuming(messageQueue string, handler func(amqp091.Delivery)) {
        forever := make(chan bool)
        err := ec.Consume(messageQueue, handler)
        if err != nil {
                log.Printf("Error consuming messages: %v", err)
                return
        }
        log.Print("Waiting for messages. To exit press CTRL+C")
        <-forever
}

func (ec *EventConsumer) Init(rabbitMQConnection string, messageQueue string, key string) error {
        conn, err := amqp091.Dial(rabbitMQConnection)
        if err != nil {
                        return fmt.Errorf("failed to connect to RabbitMQ: %w", err)
        }
        ec.connection = conn
        ch, err := conn.Channel()
        if err != nil {
                return fmt.Errorf("failed to open a RabbitMQ channel: %w", err)
        }
        ec.channel = ch

        q, err := ch.QueueDeclare(
                messageQueue,   // Queue name
                true,           // Durable
                false,          // Delete when unused
                false,          // Exclusive
                false,          // No-wait
                nil,            // Arguments
        )
        if err != nil {
                return fmt.Errorf("failed to declare queue: %w", err)
        }
        log.Println("Queue declared:", messageQueue)
        err = ch.QueueBind(
                q.Name,         // Queue name
                key,            // Routing key
                gconsts.ExchangeName,   // Exchange name
                false,          // No-wait
                nil,            // Arguments
        )
        if err != nil {
                return fmt.Errorf("failed to bind queue: %w", err)
        }
        log.Println("Queue bound to exchange:", gconsts.ExchangeName)
        return nil
}

func (ec *EventConsumer) Close() {
        if ec.channel != nil {
                err := ec.channel.Close()
                if err != nil {
                        return
                }
        }
        if ec.connection != nil {
                err := ec.connection.Close()
                if err != nil {
                        return
                }
        }
}
