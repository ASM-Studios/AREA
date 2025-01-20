package microsoft

import (
	"AREA/internal/models"
	"AREA/internal/oauth"
	"AREA/internal/pkg"
	"bytes"
	"fmt"
	"github.com/rs/zerolog/log"
	"io"
	"mime"
	"net/http"
	"net/url"
	"path/filepath"
)

func detectContentType(fileName string) string {
	contentType := mime.TypeByExtension(filepath.Ext(fileName))
	if contentType == "" {
		contentType = "text/plain"
	}
	return contentType
}

func CreateFile(user *models.User, args map[string]string) {
	var token models.Token
	pkg.DB.Where("user_id = ? AND service_id = ?", user.ID, serviceId).First(&token)
	parentFolderPath := args["folder_path"]
	if parentFolderPath == "" {
		parentFolderPath = "/"
	}
	encodedPath := url.QueryEscape(fmt.Sprintf("%s/%s", parentFolderPath, args["file_name"]))
	reqURL := fmt.Sprintf("https://graph.microsoft.com/v1.0/me/drive/root:/%s:/content", encodedPath)
	req, err := http.NewRequest("PUT", reqURL, bytes.NewBuffer([]byte(args["file_content"])))
	if err != nil {
		log.Error().Err(err).Msg("Error creating request")
		return
	}
	contentType := detectContentType(args["file_name"])
	req.Header.Set("Authorization", "Bearer "+token.Token)
	req.Header.Set("Content-Type", contentType)

	resp, err := oauth.SendRequest(&token, req)
	if err != nil {
		log.Error().Err(err).Msg("Error sending Drive Folder creation request")
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusCreated || resp.StatusCode == http.StatusAccepted {
		log.Info().Msg("File created successfully")
	} else {
		bodyBytes, _ := io.ReadAll(resp.Body)
		log.Error().
			Int("status_code", resp.StatusCode).
			Msgf("Failed to create file: %s", string(bodyBytes))
	}
}
