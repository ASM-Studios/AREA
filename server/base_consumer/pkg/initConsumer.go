package pkg

import (
	"fmt"
	amqp "github.com/rabbitmq/amqp091-go"
	"log"
	"service/consts"
)

var Consumer = &EventConsumer{}

type EventConsumer struct {
	connection *amqp.Connection
	channel    *amqp.Channel
}

func (ec *EventConsumer) Init(rabbitMQConnection string) error {
	conn, err := amqp.Dial(rabbitMQConnection)
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
		consts.MessageQueue, // Queue name
		true,                // Durable
		false,               // Delete when unused
		false,               // Exclusive
		false,               // No-wait
		nil,                 // Arguments
	)
	if err != nil {
		return fmt.Errorf("failed to declare queue: %w", err)
	}
	log.Println("Queue declared:", consts.MessageQueue)
	err = ch.QueueBind(
		q.Name,              // Queue name
		consts.Key,          // Routing key
		consts.ExchangeName, // Exchange name
		false,               // No-wait
		nil,                 // Arguments
	)
	if err != nil {
		return fmt.Errorf("failed to bind queue: %w", err)
	}
	log.Println("Queue bound to exchange:", consts.ExchangeName)
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
