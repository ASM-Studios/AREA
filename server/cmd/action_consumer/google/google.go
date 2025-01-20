package google

import (
	"AREA/internal/models"
	"AREA/internal/oauth"
	"AREA/internal/pkg"
	"AREA/internal/utils"
	"errors"
	"fmt"
	"net/http"
	"strconv"
)

type MessageList struct {
        Messages        []struct {
                Id      string  `json:"id"`
        }       `json:"messages"`
}

type Message struct {
        Id              string  `json:"id"`
        InternalDate    string  `json:"internalDate"`
        Payload struct {
                Headers []struct {
                        Name    string  `json:"name"`
                        Value   string  `json:"value"`
                }       `json:"headers"`
        }       `json:"payload"`
}

type MessageReturn struct {
        Id      string  `json:"id"`
        Date    string  `json:"date"`
}

func browseMessages(workflow *models.Workflow, token *models.Token, messageId string) (bool, []interface{}, error) {
        req, err := http.NewRequest("GET", fmt.Sprintf("https://gmail.googleapis.com/v1/users/me/messages/%s", messageId), nil)
        if err != nil {
                return false, nil, errors.New("Failed to create request")
        }

        resp, err := oauth.SendRequest(token, req)
        if err != nil {
                return false, nil, errors.New("Failed to send request")
        }
        defer resp.Body.Close()
        if resp.StatusCode != 200 {
                return false, nil, errors.New("Failed to fetch google API")
        }
        result, err := utils.ExtractBody[Message](resp)
        timestamp, _ := strconv.Atoi(result.InternalDate)
        if int64(timestamp / 1000) > workflow.LastTrigger {
                return true, nil, nil
        } else {
                return false, nil, nil
        }
}

func EmailReceived(workflow *models.Workflow, user *models.User, args map[string]string) (bool, []interface{}, error) {
        var token models.Token
        pkg.DB.Where("user_id = ? AND service_id = ?", user.ID, 3).First(&token)

        req, err := http.NewRequest("GET", "https://gmail.googleapis.com/v1/users/me/messages", nil)
        if err != nil {
                return false, nil, errors.New("Failed to create request")
        }
        req.Header.Set("Authorization", "Bearer " + token.Token)

        resp, err := oauth.SendRequest(&token, req)
        if err != nil {
                return false, nil, errors.New("Failed to send request")
        }
        defer resp.Body.Close()
        if resp.StatusCode != 200 {
                return false, nil, errors.New("Failed to fetch google API")
        }

        /*result, err := utils.ExtractBody[MessageList](resp)
        for _, message := range result.Messages {
                if browseMessages(workflow, &token, message.Id) {
                        return true
                }
        }*/
        return false, nil, nil
}
