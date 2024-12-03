package utils

import (
	"encoding/json"
	"fmt"
	"github.com/rs/zerolog/log"
	"service/consts"
	"service/models"
	"time"
)

func (ec *EventConsumer) ConsumeTriggerEvents() error {
	msgs, err := ec.channel.Consume(
		consts.MessageQueue, // Queue name
		"google_consumer",   // Consumer name
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
		var event models.TriggerEvent
		err := json.Unmarshal(msg.Body, &event)
		if err != nil {
			log.Printf("Error unmarshaling message: %v", err)
			continue
		}
		if err := ec.processEvent(event); err != nil {
			log.Printf("Error processing event: %v", err)
		}
	}

	return nil
}

func (ec *EventConsumer) processEvent(event models.TriggerEvent) error {
	var appletActions []models.AppletAction
	if err := ec.db.Where("applet_id = ?", event.AppletID).Find(&appletActions).Error; err != nil {
		return fmt.Errorf("failed to fetch applet actions: %w", err)
	}
	for _, appletAction := range appletActions {
		if err := ec.executeAction(appletAction); err != nil {
			return fmt.Errorf("failed to execute action: %w", err)
		}
	}
	now := time.Now()
	event.ProcessedAt = &now
	event.Status = models.EventStatusProcessed
	if err := ec.db.Save(&event).Error; err != nil {
		return fmt.Errorf("failed to update event status: %w", err)
	}

	return nil
}

func (ec *EventConsumer) executeAction(action models.AppletAction) error {
	var actionService models.Service
	if err := ec.db.First(&actionService, action.ActionID).Error; err != nil {
		return fmt.Errorf("failed to find action service: %w", err)
	}
	log.Printf("Executing action: %s with service: %s", action.Action.Name, actionService.Name)
	return nil
}
