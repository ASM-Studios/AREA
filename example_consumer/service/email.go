package service

import (
	"consumer/utils"
	"encoding/base64"
	"fmt"
	"golang.org/x/oauth2"
	"google.golang.org/api/gmail/v1"
)

func SendEmailTo(token *oauth2.Token, toEmail string) error {
	service, err := utils.InitGoogleAPI(token, "gmail")
	if err != nil {
		return err
	}

	gmailService := service.(*gmail.Service)
	message := []byte(fmt.Sprintf("To: %s\r\nSubject: Test Email\r\n\r\nThis is a test email sent from AREA!", toEmail))
	msg := gmail.Message{
		Raw: base64.URLEncoding.EncodeToString(message),
	}

	_, err = gmailService.Users.Messages.Send("me", &msg).Do()
	if err != nil {
		return err
	}

	return nil
}
