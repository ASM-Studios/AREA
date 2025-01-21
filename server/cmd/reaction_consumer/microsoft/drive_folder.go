package microsoft

import (
	"AREA/internal/models"
	"AREA/internal/oauth"
	"AREA/internal/pkg"
	"bytes"
	"fmt"
	"github.com/goccy/go-json"
	"github.com/rs/zerolog/log"
	"net/http"
	"net/url"
)

type FolderRequest struct {
	Name   string `json:"name"`
	Folder struct {
		Path string `json:"path"`
	} `json:"folder"`
}

func createFolderRequest(args map[string]string) ([]byte, error) {
	folderReq := FolderRequest{
		Name: args["folder_name"],
	}
	folderReq.Folder.Path = args["parent_folder_path"]
	body, err := json.Marshal(folderReq)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal folder request: %w", err)
	}
	return body, nil
}

func CreateFolder(user *models.User, args map[string]string) {
	var token models.Token
	pkg.DB.Where("user_id = ? AND service_id = ?", user.ID, serviceId).First(&token)
	body, err := createFolderRequest(args)
	if err != nil {
		log.Error().Err(err).Msg("Failed to create folder request")
	}
	encodedPath := url.QueryEscape(args["parent_folder_path"])
	reqURL := fmt.Sprintf("https://graph.microsoft.com/v1.0/me/drive/root:/%s:/children", encodedPath)
	req, err := http.NewRequest("POST", reqURL, bytes.NewBuffer(body))
	if err != nil {
		log.Error().Err(err).Msg("Error creating request")
		return
	}
	req.Header.Set("Authorization", "Bearer "+token.Token)
	req.Header.Set("Content-Type", "application/json")

	resp, err := oauth.SendRequest(&token, req)
	if err != nil {
		log.Error().Err(err).Msg("Error sending Drive Folder creation request")
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusCreated || resp.StatusCode == http.StatusAccepted {
		log.Info().Msg("Folder created successfully")
	} else {
		log.Error().Int("status_code", resp.StatusCode).Msg("Failed to create folder")
	}
}
