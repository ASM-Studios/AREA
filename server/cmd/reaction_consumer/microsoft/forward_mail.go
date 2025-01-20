package microsoft

import (
	"AREA/internal/models"
	"AREA/internal/oauth"
	"AREA/internal/pkg"
	"bytes"
	"fmt"
	"github.com/goccy/go-json"
	"github.com/rs/zerolog/log"
	"net/http"
	"strings"
)

type ForwardEmailRequest struct {
	Comment    string      `json:"comment,omitempty"`
	Recipients []Recipient `json:"toRecipients"`
}

func parseRecipients(recipient string) []Recipient {
	emails := strings.Split(recipient, ",")
	recipientList := make([]Recipient, 0, len(emails))
	for _, email := range emails {
		email = strings.TrimSpace(email)
		if email != "" {
			recipientList = append(recipientList, Recipient{
				EmailAddress: EmailAddress{Address: email},
			})
		}
	}
	return recipientList
}

func ForwardEmail(user *models.User, args map[string]string) {
	var token models.Token
	result := pkg.DB.Where("user_id = ? AND service_id = ?", user.ID, serviceId).First(&token)
	if result.Error != nil {
		log.Error().Err(result.Error).Msg("Failed to retrieve token from database")
		return
	}
	if token.Token == "" {
		log.Error().Msg("No token found for user and service")
		return
	}
	emailID := args["email_id"]
	recipient := args["recipient"]
	additionalMessage := args["additional_message"]

	forwardRequest := ForwardEmailRequest{
		Comment:    additionalMessage,
		Recipients: parseRecipients(recipient),
	}
	log.Printf("forwardRequest: %v", forwardRequest)
	body, err := json.Marshal(forwardRequest)
	if err != nil {
		log.Error().Err(err).Msg("Failed to marshal forward email request")
		return
	}
	reqURL := fmt.Sprintf("https://graph.microsoft.com/v1.0/me/messages/%s/forward", emailID)
	req, err := http.NewRequest("POST", reqURL, bytes.NewBuffer(body))
	if err != nil {
		log.Error().Err(err).Msg("Error creating HTTP request")
		return
	}
	req.Header.Set("Authorization", "Bearer "+token.Token)
	req.Header.Set("Content-Type", "application/json")
	resp, err := oauth.SendRequest(&token, req)
	if err != nil {
		log.Error().Err(err).Msg("Error sending forward email request")
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusAccepted || resp.StatusCode == http.StatusNoContent {
		log.Info().Msg("Email forwarded successfully")
	} else {
		log.Error().Int("status_code", resp.StatusCode).Msg("Failed to forward email")
	}
}
