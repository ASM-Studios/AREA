package utils

import (
	"encoding/json"
	"fmt"
	"github.com/rs/zerolog/log"
	"service/consts"
	"service/models"
	"time"
)

type RabbitMQMessage struct {
	ID        string          `json:"id"`
	Type      string          `json:"type"`
	Payload   json.RawMessage `json:"payload"`
	Timestamp time.Time       `json:"timestamp"`
}

func (ec *EventConsumer) ConsumeEvents() error {
	msgs, err := ec.channel.Consume(
		consts.MessageQueue, // Queue name
		"service_consumer",  // Consumer name
		true,                // Auto-acknowledge
		false,               // Exclusive
		false,               // No-local
		false,               // No-wait
		nil,                 // Arguments
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
	switch message.Type {
	case "action_event":
		return ec.handleActionEvent(message.Payload)
	case "reaction_event":
		return ec.handleReactionEvent(message.Payload)
	default:
		log.Printf("Unhandled message type: %s", message.Type)
		return nil
	}
}

func (ec *EventConsumer) handleActionEvent(payload json.RawMessage) error {
	var actionPayload struct {
		ServiceName string                   `json:"service_name"`
		ActionName  string                   `json:"action_name"`
		Parameters  []map[string]interface{} `json:"parameters"`
	}
	if err := json.Unmarshal(payload, &actionPayload); err != nil {
		return fmt.Errorf("failed to unmarshal action payload: %w", err)
	}
	log.Printf("Received action event for service: %s, action: %s", actionPayload.ServiceName, actionPayload.ActionName)

	var action models.Action
	if err := ec.db.Where("name = ? AND service_id = (SELECT id FROM services WHERE name = ?)", actionPayload.ActionName, actionPayload.ServiceName).First(&action).Error; err != nil {
		return fmt.Errorf("failed to find action: %w", err)
	}
	log.Printf("Executing action: %s for service: %s", action.Name, actionPayload.ServiceName)

	// TODO: Add logic to invoke the action using its parameters.

	return nil
}

func (ec *EventConsumer) handleReactionEvent(payload json.RawMessage) error {
	var reactionPayload struct {
		ServiceName  string                   `json:"service_name"`
		ReactionName string                   `json:"reaction_name"`
		Parameters   []map[string]interface{} `json:"parameters"`
	}
	if err := json.Unmarshal(payload, &reactionPayload); err != nil {
		return fmt.Errorf("failed to unmarshal reaction payload: %w", err)
	}

	var reaction models.Reaction
	if err := ec.db.Where("name = ? AND service_id = (SELECT id FROM services WHERE name = ?)", reactionPayload.ReactionName, reactionPayload.ServiceName).First(&reaction).Error; err != nil {
		return fmt.Errorf("failed to find reaction: %w", err)
	}

	log.Printf("Executing reaction: %s for service: %s", reaction.Name, reactionPayload.ServiceName)
	// TODO: Add logic to invoke the reaction using its parameters.

	return nil
}
