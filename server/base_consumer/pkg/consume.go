package pkg

import (
	"encoding/json"
	"fmt"
	amqp "github.com/rabbitmq/amqp091-go"
	"log"
	"service/consts"
	"service/models"
)

type RabbitMQMessage struct {
	WorkflowID uint `json:"workflow_id"`
	EventID    uint `json:"event_id"`
}

func (ec *EventConsumer) Consume(handler func(msg amqp.Delivery)) error {
	msgs, err := ec.channel.Consume(
		consts.MessageQueue, // Queue name
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
			handler(msg)
		}
	}()

	return nil
}

func (ec *EventConsumer) StartConsuming() {
	forever := make(chan bool)
	err := ec.Consume(func(msg amqp.Delivery) {
		log.Printf("Received message: %s", msg.Body)
	})
	if err != nil {
		log.Printf("Error consuming messages: %v", err)
		return
	}

	log.Print("Waiting for messages. To exit press CTRL+C")
	<-forever // Block forever
}

func (ec *EventConsumer) ConsumeEvents() error {
	msgs, err := ec.channel.Consume(
		consts.MessageQueue,            // Queue name
		"service_"+consts.MessageQueue, // Consumer name
		true,                           // Auto-acknowledge
		false,                          // Exclusive
		false,                          // No-local
		false,                          // No-wait
		nil,                            // Arguments
	)
	if err != nil {
		return fmt.Errorf("failed to consume messages: %w", err)
	}
	for msg := range msgs {
		var rabbitMsg RabbitMQMessage
		err := json.Unmarshal(msg.Body, &rabbitMsg)
		if err != nil {
			log.Printf("Error unmarshaling message: %v", err)
			continue
		}
		if err := ec.processMessage(rabbitMsg); err != nil {
			log.Printf("Error processing message: %v", err)
		}
	}

	return nil
}

func (ec *EventConsumer) processMessage(message RabbitMQMessage) error {
	workflow := models.Workflow{}
	event := models.Event{}
	DB.Model(&workflow).Where("id = ?", message.WorkflowID).Update("status", "processed")
	DB.Model(&event).Where("id = ?", message.EventID).First(&event)
	if event.Type == models.ActionEventType {
		return ec.processAction(event)
	} else if event.Type == models.ReactionEventType {
		return ec.processReaction(event)
	}
	return nil
}

func (ec *EventConsumer) processAction(event models.Event) error {
	log.Printf("Processing action: %v", event)
	// TODO: Implement action processing
	return nil
}

func (ec *EventConsumer) processReaction(event models.Event) error {
	log.Printf("Processing reaction: %v", event)
	// TODO: Implement reaction processing
	return nil
}
