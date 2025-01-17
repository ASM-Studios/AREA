package microsoft

import (
	"AREA/internal/models"
	"AREA/internal/oauth"
	"AREA/internal/pkg"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/rs/zerolog/log"
	"io"
	"net/http"
	"time"
)

type MailResponse struct {
	Value []struct {
		Body struct {
			Content string `json:"content"`
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
}

func fetchNewMails(workflow *models.Workflow, body []byte) (bool, []interface{}, error) {
	var mailResp MailResponse
	callReaction := false
	var interfaces []interface{}
	if err := json.Unmarshal(body, &mailResp); err != nil {
		fmt.Println("Error unmarshalling mail response:", err)
		return false, nil, err
	}
	log.Print("mailResp: ", mailResp)
	if len(mailResp.Value) == 0 {
		return false, nil, errors.New("no mail found")
	}

	for _, mail := range mailResp.Value {
		parsedTime, err := time.Parse(time.RFC3339, mail.ReceivedDateTime)
		if err != nil {
			fmt.Println("Error parsing ReceivedDateTime:", err)
			continue
		}
		if parsedTime.Unix() > workflow.LastTrigger {
			var mailVar = MailVariables{
				Subject: mail.Subject,
				Body:    mail.Body.Content,
				Sender:  mail.Sender.EmailAddress.Address,
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
	log.Print("args: ", args)
	reqURL := "https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages?$top=10&$orderby=receivedDateTime%20desc"
	req, err := http.NewRequest("GET", reqURL, nil)
	if err != nil {
		fmt.Println("Error creating request:", err)
		return false, nil, err
	}

	req.Header.Set("Authorization", "Bearer "+token.Token)
	req.Header.Set("Content-Type", "application/json")

	resp, err := oauth.SendRequest(&token, req)
	log.Print("resp: ", resp)
	if err != nil {
		fmt.Println("Error sending mail request:", err)
		return false, nil, err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	log.Print("response body: ", string(body))

	if err != nil {
		fmt.Println("Error reading mail response body:", err)
		return false, nil, err
	}
	return fetchNewMails(workflow, body)
}
