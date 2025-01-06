package microsoft

import (
        "AREA/cmd/action_consumer/vars"
        "AREA/internal/models"
        "AREA/internal/oauth"
        "AREA/internal/pkg"
        "AREA/internal/utils"
        "encoding/json"
        "fmt"
        "io"
        "log"
        "net/http"
        "time"
)

type MailResponse struct {
        Value []struct {
                ID               string `json:"id"`
                Subject          string `json:"subject"`
                ReceivedDateTime string `json:"receivedDateTime"`
        } `json:"value"`
}

func fetchNewMails(body []byte) bool {
        var mailResp MailResponse
        if err := json.Unmarshal(body, &mailResp); err != nil {
                fmt.Println("Error unmarshalling mail response:", err)
                return false
        }

        if len(mailResp.Value) == 0 {
                return false
        }

        for _, mail := range mailResp.Value {
                parsedTime, err := time.Parse(time.RFC3339, mail.ReceivedDateTime)
                if err != nil {
                        fmt.Println("Error parsing ReceivedDateTime:", err)
                        continue
                }
                log.Println("parsedTime:", parsedTime)
                log.Println("Mail ID:", mail.ID)
                log.Println("Mail Subject:", mail.Subject)
                log.Println("Mail ReceivedDateTime:", mail.ReceivedDateTime)
                if parsedTime.After(vars.LastFetch) {
                        log.Println("New mail received")
                        return true
                }
        }

        return false
}

func MailReceived(user *models.User, args map[string]string) bool {
        var token models.Token
        log.Println("Fetching token for user", user.ID)
        err := pkg.DB.Where("user_id = ? AND service_id = ?", user.ID, serviceId).First(&token).Error
        if err != nil {
                fmt.Println("Error fetching token from DB:", err)
                return false
        }
        reqURL := "https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages?$top=10&$orderby=receivedDateTime%20desc"
        req, err := http.NewRequest("GET", reqURL, nil)
        if err != nil {
                fmt.Println("Error creating request:", err)
                return false
        }

        req.Header.Set("Authorization", "Bearer "+token.Token)
        req.Header.Set("Content-Type", "application/json")

        resp, err := utils.SendRequest(req)
        if err != nil {
                fmt.Println("Error sending mail request:", err)
                return false
        }
        defer resp.Body.Close()
        if resp.StatusCode == http.StatusUnauthorized {
                oauth.FetchNewToken(&token)
                req.Header.Set("Authorization", "Bearer "+token.Token)
                resp, err = utils.SendRequest(req)
                if err != nil {
                        fmt.Println("Error sending mail request after token refresh:", err)
                        return false
                }
                defer resp.Body.Close()
        }
        body, err := io.ReadAll(resp.Body)
        if err != nil {
                fmt.Println("Error reading mail response body:", err)
                return false
        }
        println("body", string(body))
        return fetchNewMails(body)
}
