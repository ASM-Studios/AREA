package utils

import (
	"AREA/internal/models"
	"encoding/json"
	"fmt"
	"github.com/google/uuid"
	amqp "github.com/rabbitmq/amqp091-go"
	"github.com/rs/zerolog/log"
	"time"
)

type RabbitMQMessage struct {
	ID        string          `json:"id"`
	Type      string          `json:"type"`
	Payload   json.RawMessage `json:"payload"`
	Timestamp time.Time       `json:"timestamp"`
	AppletID  uint            `json:"applet_id"`
}

type EventPublisher struct {
	connection *amqp.Connection
	channel    *amqp.Channel
}

type RMQProducer struct {
	Queue            string
	ConnectionString string
}

func (x RMQProducer) OnError(err error, msg string) {
	if err != nil {
		log.Err(err).Msgf("Error occurred while publishing message on '%s' queue. Error message: %s", x.Queue, msg)
	}
}

func (x RMQProducer) PublishMessage(contentType string, body []byte) {
	conn, err := amqp.Dial(x.ConnectionString)
	x.OnError(err, "Failed to connect to RabbitMQ")
	defer conn.Close()

	ch, err := conn.Channel()
	x.OnError(err, "Failed to open a channel")
	defer ch.Close()

	q, err := ch.QueueDeclare(
		x.Queue, // name
		false,   // durable
		false,   // delete when unused
		false,   // exclusive
		false,   // no-wait
		nil,     // arguments
	)
	x.OnError(err, "Failed to declare a queue")

	err = ch.Publish(
		"",     // exchange
		q.Name, // routing key
		false,  // mandatory
		false,  // immediate
		amqp.Publishing{
			ContentType: contentType,
			Body:        body,
		})
	x.OnError(err, "Failed to publish a message")
}

func (p *EventPublisher) Close() {
	if p.channel != nil {
		_ = p.channel.Close()
	}
	if p.connection != nil {
		_ = p.connection.Close()
	}
}

func TryQueue() {
	publisher := &EventPublisher{}
	err := publisher.Init(GetEnvVar("RMQ_URL"))
	if err != nil {
		log.Printf("Failed to initialize EventPublisher: %v", err)
	}
	defer publisher.Close()

	rawPayload, err := json.Marshal(map[string]interface{}{
		"key": "value",
		"foo": "bar",
	})
	triggerEvent := models.TriggerEvent{
		AppletID:  1,
		TriggerID: 123,
		Payload:   rawPayload,
	}
	err = publisher.PublishTriggerEvent(triggerEvent)
	if err != nil {
		log.Printf("%v\n", err)
	} else {
		log.Printf("Trigger event published successfully\n")
	}
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
		"api_service_exchange", // exchange name
		"direct",               // exchange type
		true,                   // durable
		false,                  // auto-deleted
		false,                  // internal
		false,                  // no-wait
		nil,                    // arguments
	)
	if err != nil {
		return fmt.Errorf("failed to declare exchange: %w", err)
	}

	return nil
}

func (p *EventPublisher) PublishTriggerEvent(event models.TriggerEvent) error {
	payloadData := map[string]interface{}{
		"applet_id":  event.AppletID,
		"trigger_id": event.TriggerID,
		"data":       event.Payload,
	}

	rawPayload, err := json.Marshal(payloadData)
	message := RabbitMQMessage{
		ID:        uuid.New().String(),
		Type:      "trigger_event",
		Payload:   rawPayload,
		Timestamp: time.Now(),
	}

	body, err := json.Marshal(message)
	if err != nil {
		return err
	}

	return p.channel.Publish(
		"api_service_exchange",
		"google.api",
		false,
		false,
		amqp.Publishing{
			ContentType: "application/json",
			Body:        body,
		},
	)
}
