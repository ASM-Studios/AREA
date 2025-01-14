package microsoft

import (
    "AREA/cmd/action_consumer/vars"
    "AREA/internal/models"
    "AREA/internal/oauth"
    "AREA/internal/pkg"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "time"
)

type TeamsMessage struct {
    ID               string `json:"id"`
    CreatedDateTime  string `json:"createdDateTime"`
    FriendlyFromName string `json:"from"`
    Body             struct {
        Content string `json:"content"`
    } `json:"body"`
}

type TeamsMessagesResponse struct {
    Value []TeamsMessage `json:"value"`
}

func hasNewMessagesInChannel(body []byte) bool {
    var resp TeamsMessagesResponse
    if err := json.Unmarshal(body, &resp); err != nil {
        fmt.Println("Error unmarshalling Teams messages response:", err)
        return false
    }
    
    if len(resp.Value) == 0 {
        return false
    }
    for _, message := range resp.Value {
        parsedTime, err := time.Parse(time.RFC3339, message.CreatedDateTime)
        if err != nil {
            fmt.Println("Error parsing CreatedDateTime for message:", message.ID, err)
            continue
        }
        if parsedTime.After(vars.LastFetch) {
            return true
        }
    }
    return false
}

func getTeamsForUser(token models.Token) ([]map[string]string, error) {
    endpoint := "https://graph.microsoft.com/v1.0/me/joinedTeams"
    req, err := http.NewRequest("GET", endpoint, nil)
    if err != nil {
        return nil, fmt.Errorf("error creating request for teams: %v", err)
    }
    
    req.Header.Set("Authorization", "Bearer "+token.Token)
    req.Header.Set("Content-Type", "application/json")
    resp, err := oauth.SendRequest(&token, req)
    if err != nil {
        return nil, fmt.Errorf("error sending request for teams: %v", err)
    }
    defer resp.Body.Close()
    body, err := io.ReadAll(resp.Body)
    fmt.Println("body:", string(body))
    if err != nil {
        return nil, fmt.Errorf("error reading response body for teams: %v", err)
    }
    var response struct {
        Value []struct {
            ID   string `json:"id"`
            Name string `json:"displayName"`
        } `json:"value"`
    }
    if err := json.Unmarshal(body, &response); err != nil {
        return nil, fmt.Errorf("error unmarshalling teams response: %v", err)
    }
    var teams []map[string]string
    for _, team := range response.Value {
        teams = append(teams, map[string]string{"id": team.ID, "name": team.Name})
    }
    return teams, nil
}

func getChannelsForTeam(token models.Token, teamID string) ([]map[string]string, error) {
    endpoint := fmt.Sprintf("https://graph.microsoft.com/v1.0/teams/%s/channels", teamID)
    req, err := http.NewRequest("GET", endpoint, nil)
    if err != nil {
        return nil, fmt.Errorf("error creating request for channels: %v", err)
    }
    
    req.Header.Set("Authorization", "Bearer "+token.Token)
    req.Header.Set("Content-Type", "application/json")
    resp, err := oauth.SendRequest(&token, req)
    if err != nil {
        return nil, fmt.Errorf("error sending request for channels: %v", err)
    }
    defer resp.Body.Close()
    body, err := io.ReadAll(resp.Body)
    if err != nil {
        return nil, fmt.Errorf("error reading response body for channels: %v", err)
    }
    var response struct {
        Value []struct {
            ID   string `json:"id"`
            Name string `json:"displayName"`
        } `json:"value"`
    }
    if err := json.Unmarshal(body, &response); err != nil {
        return nil, fmt.Errorf("error unmarshalling channels response: %v", err)
    }
    var channels []map[string]string
    for _, channel := range response.Value {
        channels = append(channels, map[string]string{"id": channel.ID, "name": channel.Name})
    }
    return channels, nil
}

func GetTeamAndChannelIDs(token models.Token, teamName, channelName string) (string, string, error) {
    teams, err := getTeamsForUser(token)
    if err != nil {
        return "", "", fmt.Errorf("error fetching teams: %v", err)
    }
    
    var teamID string
    for _, team := range teams {
        fmt.Println("team:", team)
        if team["name"] == teamName {
            teamID = team["id"]
            break
        }
    }
    if teamID == "" {
        return "", "", fmt.Errorf("team with name %s not found", teamName)
    }
    channels, err := getChannelsForTeam(token, teamID)
    if err != nil {
        return "", "", fmt.Errorf("error fetching channels for team %s: %v", teamName, err)
    }
    var channelID string
    for _, channel := range channels {
        fmt.Println("channel:", channel)
        if channel["name"] == channelName {
            channelID = channel["id"]
            break
        }
    }
    if channelID == "" {
        return "", "", fmt.Errorf("channel with name %s not found in team %s", channelName, teamName)
    }
    return teamID, channelID, nil
}

func NewMessageInChannel(user *models.User, args map[string]string) bool {
    fmt.Println("NewMessageInChannel")
    if len(args) < 2 {
        fmt.Println("Error: NewMessageInChannel requires at least two parameters (TEAM_NAME, CHANNEL_NAME).")
        return false
    }
    teamName := args["team_name"]
    channelName := args["channel_name"]
    fmt.Println("teamName:", teamName)
    fmt.Println("channelName:", channelName)
    var token models.Token
    err := pkg.DB.Where("user_id = ? AND service_id = ?", user.ID, serviceId).
        First(&token).Error
    if err != nil {
        fmt.Println("Error fetching token from DB:", err)
        return false
    }
    teamID, channelID, err := GetTeamAndChannelIDs(token, teamName, channelName)
    if err != nil {
        fmt.Println("Error getting team and channel IDs:", err)
        return false
    }
    endpoint := fmt.Sprintf("https://graph.microsoft.com/v1.0/teams/%s/channels/%s/messages?$top=5&$orderby=createdDateTime desc",
        teamID, channelID)
    req, err := http.NewRequest("GET", endpoint, nil)
    if err != nil {
        fmt.Println("Error creating Teams message request:", err)
        return false
    }
    
    req.Header.Set("Authorization", "Bearer "+token.Token)
    req.Header.Set("Content-Type", "application/json")
    resp, err := oauth.SendRequest(&token, req)
    if err != nil {
        fmt.Println("Error sending Teams message request:", err)
        return false
    }
    defer resp.Body.Close()
    body, err := io.ReadAll(resp.Body)
    if err != nil {
        fmt.Println("Error reading Teams messages response body:", err)
        return false
    }
    fmt.Println("body:", string(body))
    return hasNewMessagesInChannel(body)
}
