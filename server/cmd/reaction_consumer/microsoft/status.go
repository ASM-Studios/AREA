package microsoft

import (
    "AREA/internal/models"
    "AREA/internal/oauth"
    "AREA/internal/pkg"
    "bytes"
    "github.com/goccy/go-json"
    "github.com/rs/zerolog/log"
    "net/http"
    "strconv"
    "time"
)

type StatusMessage struct {
    Message struct {
        Content     string `json:"content"`
        ContentType string `json:"contentType"`
    } `json:"message"`
    ExpiryDateTime struct {
        DateTime string `json:"dateTime"`
        TimeZone string `json:"timeZone"`
    } `json:"expiryDateTime,omitempty"`
}

type SetStatusMessageRequest struct {
    StatusMessage StatusMessage `json:"statusMessage"`
}

func SetCustomStatus(user *models.User, args map[string]string) {
    var token models.Token
    result := pkg.DB.Where("user_id = ? AND service_id = ?", user.ID, serviceId).First(&token)
    if result.Error != nil {
        log.Error().Err(result.Error).Msg("Failed to retrieve token from database")
        return
    }
    
    statusMessage := args["status_message"]
    expiryDuration := args["expiry_duration"]
    
    if statusMessage == "" {
        log.Error().Msg("status_message is required")
        return
    }
    
    duration := time.Hour
    if expiryDuration != "" {
        if _, err := strconv.Atoi(expiryDuration); err == nil {
            expiryDuration += "m"
        }
        parsedDuration, err := time.ParseDuration(expiryDuration)
        if err != nil {
            log.Error().Err(err).Msg("Invalid expiry duration")
            return
        }
        duration = parsedDuration
    }
    
    expiryTime := time.Now().Add(duration).Format(time.RFC3339)
    timeZone := "UTC"
    
    statusMsg := StatusMessage{
        Message: struct {
            Content     string `json:"content"`
            ContentType string `json:"contentType"`
        }{
            Content:     statusMessage,
            ContentType: "text",
        },
    }
    
    if expiryDuration != "" {
        statusMsg.ExpiryDateTime = struct {
            DateTime string `json:"dateTime"`
            TimeZone string `json:"timeZone"`
        }{
            DateTime: expiryTime,
            TimeZone: timeZone,
        }
    }
    
    requestBody := SetStatusMessageRequest{
        StatusMessage: statusMsg,
    }
    
    body, err := json.Marshal(requestBody)
    if err != nil {
        log.Error().Err(err).Msg("Failed to marshal request body")
        return
    }
    
    reqURL := "https://graph.microsoft.com/v1.0/me/presence/setStatusMessage"
    req, err := http.NewRequest("POST", reqURL, bytes.NewBuffer(body))
    if err != nil {
        log.Error().Err(err).Msg("Error creating HTTP request")
        return
    }
    req.Header.Set("Authorization", "Bearer "+token.Token)
    req.Header.Set("Content-Type", "application/json")
    
    resp, err := oauth.SendRequest(&token, req)
    if err != nil {
        log.Error().Err(err).Msg("Error sending request")
        return
    }
    defer resp.Body.Close()
    
    if resp.StatusCode == http.StatusOK {
        log.Info().Msg("Custom status set successfully")
    } else {
        log.Error().Int("status_code", resp.StatusCode).Msg("Failed to set custom status")
    }
}
