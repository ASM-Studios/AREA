package utils

import (
	"fmt"
	amqp "github.com/rabbitmq/amqp091-go"
	"gorm.io/gorm"
	"service/consts"
)

type EventConsumer struct {
	connection *amqp.Connection
	channel    *amqp.Channel
	db         *gorm.DB
}

func (ec *EventConsumer) Init(rabbitMQConnection string, db *gorm.DB) error {
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
	err = ch.QueueBind(
		q.Name,              // Queue name
		consts.Key,          // Routing key for Google API
		consts.ExchangeName, // Exchange name
		false,               // No-wait
		nil,                 // Arguments
	)
	if err != nil {
		return fmt.Errorf("failed to declare queue: %w", err)
	}
	ec.db = db
	return nil
}
