package microsoft

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
)

type MailMessage struct {
	ID               string `json:"id"`
	Subject          string `json:"subject"`
	ReceivedDateTime string `json:"receivedDateTime"`
	IsRead           bool   `json:"isRead"`
	From             struct {
		EmailAddress struct {
			Name    string `json:"name"`
			Address string `json:"address"`
		} `json:"emailAddress"`
	} `json:"from"`
}

type MailListResponse struct {
	Value []MailMessage `json:"value"`
}

func (c *APIClient) HandleNewEmailReceived(workflowID uint) error {
	endpoint := "https://graph.microsoft.com/v1.0/me/mailFolders/Inbox/messages?$filter=isRead%20eq%20false&$top=1&$orderby=receivedDateTime%20desc"

	req, err := http.NewRequest("GET", endpoint, nil)
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}
	req.Header.Set("Authorization", "Bearer "+c.Token)
	req.Header.Set("Accept", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to retrieve emails: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := ioutil.ReadAll(resp.Body)
		return fmt.Errorf("non-200 response: %d, body: %s", resp.StatusCode, string(bodyBytes))
	}

	var mailList MailListResponse
	if err := json.NewDecoder(resp.Body).Decode(&mailList); err != nil {
		return fmt.Errorf("failed to decode mail response: %w", err)
	}

	if len(mailList.Value) == 0 {
		log.Println("No new unread emails found.")
		return nil
	}

	for _, message := range mailList.Value {
		log.Printf("New Email Received: Subject=%q, From=%q, ReceivedAt=%s",
			message.Subject, message.From.EmailAddress.Address, message.ReceivedDateTime)

		if err := c.MarkEmailAsRead(message.ID); err != nil {
			log.Printf("Failed to mark email %s as read: %v", message.ID, err)
		}
	}

	return nil
}

func (c *APIClient) MarkEmailAsRead(messageID string) error {
	endpoint := fmt.Sprintf("https://graph.microsoft.com/v1.0/me/messages/%s", messageID)
	reqBody := `{"isRead": true}`
	req, err := http.NewRequest("PATCH", endpoint, strings.NewReader(reqBody))
	if err != nil {
		return fmt.Errorf("failed to create patch request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+c.Token)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send PATCH request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		bodyBytes, _ := ioutil.ReadAll(resp.Body)
		return fmt.Errorf("failed to mark email as read, status: %d, body: %s", resp.StatusCode, string(bodyBytes))
	}

	log.Printf("Email %s marked as read.", messageID)
	return nil
}
