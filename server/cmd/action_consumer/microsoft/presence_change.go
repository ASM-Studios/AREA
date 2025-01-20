package microsoft

import (
    "AREA/internal/models"
    "AREA/internal/oauth"
    "AREA/internal/pkg"
    "fmt"
    "github.com/goccy/go-json"
    "github.com/rs/zerolog/log"
    "io"
    "net/http"
    "sync"
)

type Presence struct {
    Availability string `json:"availability"`
    Activity     string `json:"activity"`
}

var (
    lastPresence  = make(map[int]Presence)
    presenceMutex sync.Mutex
)

func fetchPresence(token models.Token) (Presence, error) {
    var presence Presence
    url := "https://graph.microsoft.com/v1.0/me/presence"
    
    req, err := http.NewRequest("GET", url, nil)
    if err != nil {
        log.Printf("Error creating request: %v\n", err)
        return presence, err
    }
    
    req.Header.Set("Authorization", "Bearer "+token.Token)
    req.Header.Set("Content-Type", "application/json")
    
    resp, err := oauth.SendRequest(&token, req)
    if err != nil {
        return presence, fmt.Errorf("error sending request: %w", err)
    }
    defer resp.Body.Close()
    
    if resp.StatusCode != http.StatusOK {
        body, _ := io.ReadAll(resp.Body)
        log.Printf("Error response body: %s\n", string(body))
        return presence, fmt.Errorf("unexpected status code: %d", resp.StatusCode)
    }
    
    body, err := io.ReadAll(resp.Body)
    if err != nil {
        return presence, fmt.Errorf("error reading response body: %w", err)
    }
    
    if err := json.Unmarshal(body, &presence); err != nil {
        return presence, fmt.Errorf("error unmarshalling response: %w", err)
    }
    
    log.Printf("Fetched Presence: %+v\n", presence)
    return presence, nil
}

func ChangePresence(_ *models.Workflow, user *models.User, _ map[string]string) (bool, []interface{}, error) {
    var token models.Token
    callReaction := false
    var interfaces []interface{}
    
    err := pkg.DB.Where("user_id = ? AND service_id = ?", user.ID, serviceId).First(&token).Error
    if err != nil {
        log.Printf("Error fetching token from DB: %v\n", err)
        return false, nil, err
    }
    
    presence, err := fetchPresence(token)
    if err != nil {
        log.Printf("Error fetching presence: %v\n", err)
        return false, nil, err
    }
    presenceMutex.Lock()
    previousPresence, exists := lastPresence[int(user.ID)]
    if !exists || presence.Availability != previousPresence.Availability || presence.Activity != previousPresence.Activity {
        if !exists {
            lastPresence[int(user.ID)] = presence
            presenceMutex.Unlock()
            return false, nil, nil
        }
        callReaction = true
        interfaces = append(interfaces, presence)
        log.Printf("Presence changed: %+v\n", presence)
    }
    lastPresence[int(user.ID)] = presence
    presenceMutex.Unlock()
    
    return callReaction, interfaces, nil
}
