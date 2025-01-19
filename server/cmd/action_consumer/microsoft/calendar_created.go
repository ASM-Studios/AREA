package microsoft

import (
    "AREA/internal/models"
    "AREA/internal/oauth"
    "AREA/internal/pkg"
    "fmt"
    "github.com/goccy/go-json"
    "io"
    "net/http"
    "time"
)

func hasEventCreated(workflow *models.Workflow, body []byte) (bool, []interface{}, error) {
    var eventsResp MicrosoftEventsResponse
    callReaction := false
    var interfaces []interface{}
    if err := json.Unmarshal(body, &eventsResp); err != nil {
        fmt.Println("Error unmarshalling events response:", err)
        return callReaction, nil, nil
    }
    
    if len(eventsResp.Value) == 0 {
        return callReaction, nil, nil
    }
    
    for _, ev := range eventsResp.Value {
        createdTime, err := time.Parse(time.RFC3339, ev.CreatedDateTime)
        if err != nil {
            fmt.Println("Error parsing createdDateTime for event:", ev.Subject, err)
            continue
        }
        if createdTime.Unix() > workflow.LastTrigger {
            fmt.Printf("Detected created event: %s (created: %s)\n", ev.Subject, createdTime)
            var calendarVar = CalendarValue{
                Subject:   ev.Subject,
                Organizer: ev.Organizer.EmailAddress.Address,
                Location:  ev.Location.DisplayName,
            }
            callReaction = true
            interfaces = append(interfaces, calendarVar)
        }
    }
    return callReaction, interfaces, nil
}

func CalendarEventCreated(workflow *models.Workflow, user *models.User, _ map[string]string) (bool, []interface{}, error) {
    var token models.Token
    err := pkg.DB.Where("user_id = ? AND service_id = ?", user.ID, serviceId).First(&token).Error
    if err != nil {
        fmt.Println("Error fetching token from DB:", err)
        return false, nil, nil
    }
    
    reqURL := "https://graph.microsoft.com/v1.0/me/events?$orderby=createdDateTime%20desc&$top=10"
    
    req, err := http.NewRequest("GET", reqURL, nil)
    if err != nil {
        fmt.Println("Error creating request:", err)
        return false, nil, nil
    }
    req.Header.Set("Authorization", "Bearer "+token.Token)
    req.Header.Set("Content-Type", "application/json")
    
    resp, err := oauth.SendRequest(&token, req)
    if err != nil {
        fmt.Println("Error sending initial request:", err)
        return false, nil, nil
    }
    defer resp.Body.Close()
    
    body, err := io.ReadAll(resp.Body)
    if err != nil {
        fmt.Println("Error reading response body:", err)
        return false, nil, nil
    }
    
    return hasEventCreated(workflow, body)
}
