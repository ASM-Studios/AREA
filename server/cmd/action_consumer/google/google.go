package google

import (
	"AREA/internal/gconsts"
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
                Parts   []struct {
                        MimeType        string  `json:"mimeType"`
                        Body struct {
                                Data    string  `json:"data"`
                        }       `json:"body"`
                }       `json:"parts"`
        }       `json:"payload"`
}

type MessageReturn struct {
        Id      string  `json:"id"`
        Date    string  `json:"date"`
        From    string  `json:"from"`
        Object  string  `json:"object"`
        Content string  `json:"content"`
}

func extractMessage(message *Message) MessageReturn {
        var messageReturn MessageReturn
        for _, header := range message.Payload.Headers {
                if header.Name == "Date" {
                        messageReturn.Date = header.Value
                } else if header.Name == "From" {
                        messageReturn.From = header.Value
                } else if header.Name == "Subject" {
                        messageReturn.Object = header.Value
                }
        }
        for _, part := range message.Payload.Parts {
                if part.MimeType == "text/plain" {
                        messageReturn.Content = part.Body.Data
                }
        }
        return messageReturn
}

func browseMessages(workflow *models.Workflow, token *models.Token, messageId string) (bool, interface{}, error) {
        req, err := http.NewRequest("GET", fmt.Sprintf("https://gmail.googleapis.com/gmail/v1/users/me/messages/%s", messageId), nil)
        if err != nil {
                return false, nil, errors.New("Failed to create request")
        }
        req.Header.Set("Authorization", "Bearer " + token.Token)

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
                return true, extractMessage(result), nil
        } else {
                return false, nil, nil
        }
}

func EmailReceived(workflow *models.Workflow, user *models.User, args map[string]string) (bool, []interface{}, error) {
        var token models.Token
        pkg.DB.Where("user_id = ? AND service_id = ?", user.ID, gconsts.ServiceMap["google"]).First(&token)

        req, err := http.NewRequest("GET", "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10", nil)
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

        callReaction := false
        var interfaces []interface{}
        result, err := utils.ExtractBody[MessageList](resp)
        for _, message := range result.Messages {
                status, body, err := browseMessages(workflow, &token, message.Id)
                if err != nil {
                        continue
                }
                if status {
                        callReaction = true
                        interfaces = append(interfaces, body)
                }
        }
        return callReaction, interfaces, nil
}
