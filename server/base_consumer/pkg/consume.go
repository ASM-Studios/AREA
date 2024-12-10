package pkg

import (
	"fmt"
	"github.com/goccy/go-json"
	"log"
	"service/consts"
	"service/handlers"
	"service/models"
)

func (ec *EventConsumer) Consume(handler func(msg models.WorkflowEvent)) error {
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
			var workflowEvents []models.WorkflowEvent
			if err := json.Unmarshal(msg.Body, &workflowEvents); err != nil {
				log.Printf("Failed to unmarshal message: %v", err)
				continue
			}
			for _, workflowEvent := range workflowEvents {
				handler(workflowEvent)
			}
		}
	}()
	return nil
}

func (ec *EventConsumer) StartConsuming() {
	forever := make(chan bool)
	err := ec.Consume(handlers.HandleWorkflowEvent)
	if err != nil {
		log.Printf("Error consuming messages: %v", err)
		return
	}
	log.Print("Waiting for messages. To exit press CTRL+C")
	<-forever
}
