package microsoft

import (
	"AREA/internal/models"
	"AREA/internal/oauth"
	"AREA/internal/pkg"
	"bytes"
	"github.com/goccy/go-json"
	"github.com/rs/zerolog/log"
	"net/http"
)

type EmailAddress struct {
	Address string `json:"address"`
	Name    string `json:"name,omitempty"`
}

type Recipient struct {
	EmailAddress EmailAddress `json:"emailAddress"`
}

type Message struct {
	Subject      string      `json:"subject"`
	Body         MessageBody `json:"body"`
	ToRecipients []Recipient `json:"toRecipients"`
}

type MessageBody struct {
	ContentType string `json:"contentType"`
	Content     string `json:"content"`
}

type MailRequest struct {
	Message Message `json:"message"`
}

func createMailRequest(args map[string]string) []byte {
	log.Printf("Creating mail request, %v\n", args)
	mail := MailRequest{
		Message: Message{
			Subject: args["subject"],
			Body: MessageBody{
				ContentType: "Text",
				Content:     args["body"],
			},
			ToRecipients: []Recipient{
				{
					EmailAddress: EmailAddress{
						Address: args["recipient"],
					},
				},
			},
		},
	}
	body, err := json.Marshal(mail)
	if err != nil {
		log.Error().Err(err).Msg("Failed to marshal mail request")
	}
	return body
}

func SendEmail(user *models.User, args map[string]string) {
	var token models.Token
	pkg.DB.Where("user_id = ? AND service_id = ?", user.ID, serviceId).First(&token)

	body := createMailRequest(args)

	reqURL := "https://graph.microsoft.com/v1.0/me/sendMail"
	req, err := http.NewRequest("POST", reqURL, bytes.NewBuffer(body))
	if err != nil {
		log.Error().Err(err).Msg("Error creating request")
		return
	}
	req.Header.Set("Authorization", "Bearer "+token.Token)
	req.Header.Set("Content-Type", "application/json")

	resp, err := oauth.SendRequest(&token, req)
	if err != nil {
		log.Error().Err(err).Msg("Error sending mail request")
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusAccepted {
		log.Error().Int("status_code", resp.StatusCode).Msg("Failed to send email")
	} else {
		log.Info().Msg("Email sent successfully")
	}
}
