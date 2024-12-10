package pkg

import (
	"AREA/internal/consts"
	"AREA/internal/utils"
	"fmt"
	amqp "github.com/rabbitmq/amqp091-go"
	"log"
)

var Publisher *EventPublisher

type EventPublisher struct {
	connection *amqp.Connection
	channel    *amqp.Channel
}

func (p *EventPublisher) Init(connectionString string) error {
	conn, err := amqp.Dial(connectionString)
	if err != nil {
		return fmt.Errorf("failed to connect to RabbitMQ: %w", err)
	}
	p.connection = conn
	ch, err := conn.Channel()
	if err != nil {
		return fmt.Errorf("failed to open a RabbitMQ channel: %w", err)
	}
	p.channel = ch
	err = ch.ExchangeDeclare(
		consts.ExchangeName, // exchange name
		"topic",             // exchange type
		true,                // durable
		false,               // auto-deleted
		false,               // internal
		false,               // no-wait
		nil,                 // arguments
	)
	if err != nil {
		return fmt.Errorf("failed to declare exchange: %w", err)
	}

	return nil
}

func (p *EventPublisher) Produce(message []byte, routingKey string) error {
	err := p.channel.Publish(
		consts.ExchangeName, // exchange
		routingKey,          // routing key
		false,               // mandatory
		false,               // immediate
		amqp.Publishing{
			ContentType: "application/json",
			Body:        message,
		},
	)
	if err != nil {
		return fmt.Errorf("failed to publish message: %w", err)
	}
	return nil
}

func InitRabbitMQ() error {
	Publisher = &EventPublisher{}
	log.Println("Initializing RabbitMQ connection")
	err := Publisher.Init(utils.GetEnvVar("RMQ_URL"))
	if err != nil {
		log.Fatalf("Failed to initialize RabbitMQ connection: %v", err)
		return err
	}
	log.Printf("RabbitMQ connection established: exchange on %s\n", consts.ExchangeName)
	return nil
}
