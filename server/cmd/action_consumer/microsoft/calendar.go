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
        "net/http"
        "time"
)

type MicrosoftEvent struct {
        Subject string `json:"subject"`
        Start   struct {
                DateTime string `json:"dateTime"`
                TimeZone string `json:"timeZone"`
        } `json:"start"`
}

type MicrosoftEventsResponse struct {
        Value []MicrosoftEvent `json:"value"`
}

func hasEventStarted(body []byte) bool {
        var eventsResp MicrosoftEventsResponse
        if err := json.Unmarshal(body, &eventsResp); err != nil {
                fmt.Println("Error unmarshalling events response:", err)
                return false
        }

        if len(eventsResp.Value) == 0 {
                return false
        }

        now := time.Now()
        lastCheck := vars.LastFetch

        for _, ev := range eventsResp.Value {
                startTime, err := time.Parse(time.RFC3339, ev.Start.DateTime)
                if err != nil {
                        fmt.Println("Error parsing start.DateTime for event:", ev.Subject, err)
                        continue
                }
                if startTime.After(lastCheck) && startTime.Before(now) {
                        fmt.Printf("Detected started event: %s (start: %s)\n", ev.Subject, startTime)
                        return true
                }
        }
        return false
}

func CalendarEventStarted(user *models.User, args map[string]string) bool {
        var token models.Token
        err := pkg.DB.Where("user_id = ? AND service_id = ?", user.ID, serviceId).First(&token).Error
        if err != nil {
                fmt.Println("Error fetching token from DB:", err)
                return false
        }

        reqURL := "https://graph.microsoft.com/v1.0/me/events?$orderby=start/dateTime%20desc&$top=10"

        req, err := http.NewRequest("GET", reqURL, nil)
        if err != nil {
                fmt.Println("Error creating request:", err)
                return false
        }
        req.Header.Set("Authorization", "Bearer "+token.Token)
        req.Header.Set("Content-Type", "application/json")

        resp, err := utils.SendRequest(req)
        if err != nil {
                fmt.Println("Error sending initial request:", err)
                return false
        }
        defer resp.Body.Close()

        if resp.StatusCode == http.StatusUnauthorized {
                oauth.FetchNewToken(&token)
                req.Header.Set("Authorization", "Bearer "+token.Token)
                resp, err = utils.SendRequest(req)
                if err != nil {
                        fmt.Println("Error sending second request after token refresh:", err)
                        return false
                }
                defer resp.Body.Close()
        }

        body, err := io.ReadAll(resp.Body)
        if err != nil {
                fmt.Println("Error reading response body:", err)
                return false
        }

        return hasEventStarted(body)
}
