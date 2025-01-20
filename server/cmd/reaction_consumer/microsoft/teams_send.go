package microsoft

import (
    "AREA/internal/models"
    "AREA/internal/oauth"
    "AREA/internal/pkg"
    "bytes"
    "fmt"
    "github.com/goccy/go-json"
    "github.com/rs/zerolog/log"
    "io"
    "net/http"
)

func getTeamsIdByName(name string, token models.Token) (string, error) {
    teamsEndpoint := "https://graph.microsoft.com/v1.0/me/joinedTeams"
    req, _ := http.NewRequest("GET", teamsEndpoint, nil)
    req.Header.Set("Authorization", "Bearer "+token.Token)
    req.Header.Set("Content-Type", "application/json")
    resp, err := oauth.SendRequest(&token, req)
    if err != nil {
        return "", fmt.Errorf("error fetching teams: %w", err)
    }
    defer resp.Body.Close()
    
    var teamsResponse struct {
        Value []struct {
            ID          string `json:"id"`
            DisplayName string `json:"displayName"`
        } `json:"value"`
    }
    body, _ := io.ReadAll(resp.Body)
    json.Unmarshal(body, &teamsResponse)
    
    for _, team := range teamsResponse.Value {
        if team.DisplayName == name {
            return team.ID, nil
        }
    }
    return "", nil
}

func getChannelIdByName(channelName, teamId string, token models.Token) (string, error) {
    channelsEndpoint := "https://graph.microsoft.com/v1.0/teams/" + teamId + "/channels"
    req, _ := http.NewRequest("GET", channelsEndpoint, nil)
    req.Header.Set("Authorization", "Bearer "+token.Token)
    req.Header.Set("Content-Type", "application/json")
    
    resp, err := oauth.SendRequest(&token, req)
    if err != nil {
        return "", fmt.Errorf("error fetching channels: %w", err)
    }
    defer resp.Body.Close()
    
    var channelsResponse struct {
        Value []struct {
            ID          string `json:"id"`
            DisplayName string `json:"displayName"`
        } `json:"value"`
    }
    body, _ := io.ReadAll(resp.Body)
    json.Unmarshal(body, &channelsResponse)
    
    for _, channel := range channelsResponse.Value {
        log.Printf("Channel: %v Channel_requested: %v\n", channel, channelName)
        if channel.DisplayName == channelName {
            return channel.ID, nil
        }
    }
    return "", fmt.Errorf("channel not found")
}

func sendMessageToChannel(teamId, channelId, message string, token models.Token) error {
    messagesEndpoint := "https://graph.microsoft.com/v1.0/teams/" + teamId + "/channels/" + channelId + "/messages"
    
    payload := map[string]interface{}{
        "body": map[string]string{
            "content": message,
        },
    }
    
    payloadBytes, _ := json.Marshal(payload)
    req, _ := http.NewRequest("POST", messagesEndpoint, bytes.NewReader(payloadBytes))
    req.Header.Set("Authorization", "Bearer "+token.Token)
    req.Header.Set("Content-Type", "application/json")
    
    resp, err := oauth.SendRequest(&token, req)
    if err != nil {
        return fmt.Errorf("error sending message: %w", err)
    }
    defer resp.Body.Close()
    
    if resp.StatusCode != http.StatusCreated {
        body, _ := io.ReadAll(resp.Body)
        return fmt.Errorf("failed to send message, status: %d, response: %s", resp.StatusCode, string(body))
    }
    
    return nil
}

func SendMessageInChannel(user *models.User, args map[string]string) {
    var token models.Token
    if err := pkg.DB.Where("user_id = ? AND service_id = ?", user.ID, serviceId).First(&token).Error; err != nil {
        log.Printf("Error fetching token: %v\n", err)
        return
    }
    
    teamId, err := getTeamsIdByName(args["team_name"], token)
    if err != nil {
        log.Printf("Error getting team ID by name: %v\n", err)
        return
    }
    
    channelId, err := getChannelIdByName(args["channel_name"], teamId, token)
    if err != nil {
        log.Printf("Error getting channel ID by name: %v\n", err)
        return
    }
    
    message := args["message"]
    if err := sendMessageToChannel(teamId, channelId, message, token); err != nil {
        log.Printf("Error sending message to channel: %v\n", err)
    } else {
        log.Printf("Message sent successfully!\n")
    }
}
