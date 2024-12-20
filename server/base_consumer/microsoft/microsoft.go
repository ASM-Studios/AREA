package microsoft

import (
	"fmt"
	"log"
	"service/models"
	"service/utils"
)

func (c *APIClient) ProcessWorkflowEvent(workflowID, eventID uint) error {
	var event models.Event
	if err := utils.DB.First(&event, eventID).Error; err != nil {
		return fmt.Errorf("event not found: %w", err)
	}

	log.Printf("Processing workflow event in Microsoft API: workflowID=%d, eventID=%d, eventName=%s, eventType=%s",
		workflowID, eventID, event.Name, event.Type)

	switch event.Type {
	case models.ActionEventType:

		switch event.Name {
		case "New Email Received":
			return c.HandleNewEmailReceived(workflowID)
			/*case "File uploaded":
			return c.HandleFileUploaded(workflowID)*/
		}

	case models.ReactionEventType:
		/*if event.Name == "Send an Email" {
			return c.SendEmail(workflowID, eventID)
		} else if event.Name == "Upload a file" {
			return c.UploadFileToOneDrive(workflowID, eventID)
		}*/
	}

	return fmt.Errorf("unhandled event type: %s (%s)", event.Type, event.Name)
}
