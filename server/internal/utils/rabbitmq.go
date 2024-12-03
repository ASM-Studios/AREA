package utils

import (
	"AREA/internal/consts"
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
		consts.ExchangeName, // exchange
		q.Name,              // routing key
		false,               // mandatory
		false,               // immediate
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
		return
	}
	defer publisher.Close()
	actionPayload := map[string]interface{}{
		"service_name": "facebook",
		"action_name":  "new_message_in_group_w/o",
		"parameters":   []string{},
	}
	rawPayload, err := json.Marshal(actionPayload)
	if err != nil {
		log.Printf("Failed to marshal payload: %v", err)
		return
	}
	actionEvent := models.Action{
		ServiceID:   1,
		Service:     models.Service{Name: "facebook"},
		Name:        "new_message_in_group_w/o",
		Description: "A new message is posted in the group",
		Parameters:  []models.ActionParam{},
	}

	err = publisher.PublishActionEvent(actionEvent, rawPayload)
	if err != nil {
		log.Printf("Failed to publish action event: %v", err)
	} else {
		log.Printf("Action event published successfully")
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
		consts.ExchangeName, // exchange name
		"direct",            // exchange type
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

func (p *EventPublisher) PublishActionEvent(action models.Action, rawPayload []byte) error {
	if action.ServiceID == 0 || action.Name == "" {
		return fmt.Errorf("invalid action: ServiceID or Name is missing")
	}
	payloadData := map[string]interface{}{
		"service_name": action.Service.Name,
		"action_name":  action.Name,
		"description":  action.Description,
		"parameters":   action.Parameters,
		"data":         rawPayload,
	}

	rawPayloadData, err := json.Marshal(payloadData)
	if err != nil {
		log.Printf("Failed to marshal action event payload: %v", err)
		return err
	}

	message := RabbitMQMessage{
		ID:        uuid.New().String(),
		Type:      "action_event",
		Payload:   rawPayloadData,
		Timestamp: time.Now(),
	}
	body, err := json.Marshal(message)
	if err != nil {
		log.Printf("Failed to marshal RabbitMQ message: %v", err)
		return err
	}
	log.Printf("Publishing action event to RabbitMQ on key %s.api", action.Service.Name)
	err = p.channel.Publish(
		consts.ExchangeName,
		action.Service.Name+".api",
		false,
		false,
		amqp.Publishing{
			ContentType: "application/json",
			Body:        body,
		},
	)
	if err != nil {
		log.Printf("Failed to publish message to RabbitMQ: %v", err)
		return err
	}

	log.Printf("Action event successfully published to RabbitMQ")
	return nil
}
