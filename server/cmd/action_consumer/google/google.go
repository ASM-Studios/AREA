package google

import (
	"AREA/cmd/action_consumer/vars"
	"AREA/internal/models"
	"AREA/internal/oauth"
	"AREA/internal/pkg"
	"AREA/internal/utils"
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
        Id      string  `json:"id"`
        InternalDate    string  `json:"internalDate"`
        Payload struct {
                Headers []struct {
                        Name    string  `json:"name"`
                        Value   string  `json:"value"`
                }       `json:"headers"`
        }       `json:"payload"`
}

func browseMessages(token *models.Token, messageId string) bool {
        req, err := http.NewRequest("GET", fmt.Sprintf("https://gmail.googleapis.com/v1/users/me/messages/%s", messageId), nil)
        if err != nil {
                return false
        }

        resp, err := oauth.SendRequest(token, req)
        if err != nil {
                return false
        }
        defer resp.Body.Close()
        if resp.StatusCode != 200 {
                return false
        }
        result, err := utils.ExtractBody[Message](resp)
        timestamp, _ := strconv.Atoi(result.InternalDate)
        if int64(timestamp / 1000) > vars.LastFetch {
                return true
        } else {
                return false
        }
}

func EmailReceived(user *models.User, args map[string]string) bool {
        var token models.Token
        pkg.DB.Where("user_id = ? AND service_id = ?", user.ID, 3).First(&token)

        req, err := http.NewRequest("GET", "https://gmail.googleapis.com/v1/users/me/messages", nil)
        if err != nil {
                return false
        }
        req.Header.Set("Authorization", "Bearer " + token.Token)

        resp, err := oauth.SendRequest(&token, req)
        if err != nil {
                return false
        }
        defer resp.Body.Close()
        if resp.StatusCode != 200 {
                return false
        }

        result, err := utils.ExtractBody[MessageList](resp)
        for _, message := range result.Messages {
                if browseMessages(&token, message.Id) {
                        return true
                }
        }
        return false
}
