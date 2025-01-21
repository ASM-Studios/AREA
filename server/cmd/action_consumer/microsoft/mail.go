package microsoft

import (
	"AREA/internal/models"
	"AREA/internal/oauth"
	"AREA/internal/pkg"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/microcosm-cc/bluemonday"
	"io"
	"net/http"
	"time"
)

type MailResponse struct {
	Value []struct {
		Id   string `json:"id"`
		Body struct {
			ContentType string `json:"contentType"`
			Content     string `json:"content"`
		} `json:"body"`
		Subject string `json:"subject"`
		Sender  struct {
			EmailAddress struct {
				Address string `json:"address"`
			} `json:"emailAddress"`
		} `json:"sender"`
		ReceivedDateTime string `json:"receivedDateTime"`
	} `json:"value"`
}

type MailVariables struct {
	Sender  string `json:"sender"`
	Subject string `json:"subject"`
	Body    string `json:"body"`
	Id      string `json:"email_id"`
}

func fetchNewMails(workflow *models.Workflow, body []byte) (bool, []interface{}, error) {
	var mailResp MailResponse
	callReaction := false
	var interfaces []interface{}
	if err := json.Unmarshal(body, &mailResp); err != nil {
		fmt.Println("Error unmarshalling mail response:", err)
		return false, nil, err
	}
	if len(mailResp.Value) == 0 {
		return false, nil, errors.New("no mail found")
	}
	p := bluemonday.StrictPolicy()

	for _, mail := range mailResp.Value {
		parsedTime, err := time.Parse(time.RFC3339, mail.ReceivedDateTime)
		if err != nil {
			fmt.Println("Error parsing ReceivedDateTime:", err)
			continue
		}
		if parsedTime.Unix() > workflow.LastTrigger {
			var plainTextBody string
			if mail.Body.ContentType == "html" {
				plainTextBody = p.Sanitize(mail.Body.Content)
			} else {
				plainTextBody = mail.Body.Content
			}

			var mailVar = MailVariables{
				Subject: mail.Subject,
				Body:    plainTextBody,
				Sender:  mail.Sender.EmailAddress.Address,
				Id:      mail.Id,
			}
			callReaction = true
			interfaces = append(interfaces, mailVar)
		}
	}
	return callReaction, interfaces, nil
}

func MailReceived(workflow *models.Workflow, user *models.User, args map[string]string) (bool, []interface{}, error) {
	var token models.Token
	err := pkg.DB.Where("user_id = ? AND service_id = ?", user.ID, serviceId).First(&token).Error
	if err != nil {
		fmt.Println("Error fetching token from DB:", err)
		return false, nil, err
	}
	reqURL := "https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages?$top=10&$orderby=receivedDateTime%20desc"
	req, err := http.NewRequest("GET", reqURL, nil)
	if err != nil {
		fmt.Println("Error creating request:", err)
		return false, nil, err
	}

	req.Header.Set("Authorization", "Bearer "+token.Token)
	req.Header.Set("Content-Type", "application/json")

	resp, err := oauth.SendRequest(&token, req)
	if err != nil {
		fmt.Println("Error sending mail request:", err)
		return false, nil, err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading mail response body:", err)
		return false, nil, err
	}
	return fetchNewMails(workflow, body)
}
