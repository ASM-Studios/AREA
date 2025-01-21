package microsoft

import (
    "AREA/internal/models"
    "AREA/internal/oauth"
    "AREA/internal/pkg"
    "bytes"
    "fmt"
    "github.com/rs/zerolog/log"
    "io"
    "net/http"
    "net/url"
)

func WriteFile(user *models.User, args map[string]string) {
    var token models.Token
    result := pkg.DB.Where("user_id = ? AND service_id = ?", user.ID, serviceId).First(&token)
    if result.Error != nil {
        log.Error().Err(result.Error).Msg("Failed to retrieve token from database")
        return
    }
    filePath := args["file_path"]
    fileContent := args["file_content"]
    
    if filePath == "" || fileContent == "" {
        log.Error().Msg("file_path or file_content is missing")
        return
    }
    encodedFilePath := url.QueryEscape(filePath)
    reqURL := fmt.Sprintf("https://graph.microsoft.com/v1.0/me/drive/root:/%s:/content", encodedFilePath)
    req, err := http.NewRequest("PUT", reqURL, bytes.NewBuffer([]byte(fileContent)))
    if err != nil {
        log.Error().Err(err).Msg("Error creating HTTP request")
        return
    }
    
    contentType := detectContentType(filePath)
    req.Header.Set("Authorization", "Bearer "+token.Token)
    req.Header.Set("Content-Type", contentType)
    
    // Send the request
    resp, err := oauth.SendRequest(&token, req)
    if err != nil {
        log.Error().Err(err).Msg("Error sending file write request")
        return
    }
    defer resp.Body.Close()
    
    if resp.StatusCode == http.StatusOK || resp.StatusCode == http.StatusCreated {
        log.Info().Msg("File updated successfully")
    } else {
        bodyBytes, _ := io.ReadAll(resp.Body)
        log.Error().
            Int("status_code", resp.StatusCode).
            Msgf("Failed to update file: %s", string(bodyBytes))
    }
}
