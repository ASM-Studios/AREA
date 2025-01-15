package microsoft

import (
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

type DriveResponse struct {
	Value []struct {
		ID              string `json:"id"`
		Name            string `json:"name"`
		Size            int    `json:"size"`
		CreatedDateTime string `json:"createdDateTime"`
	} `json:"value"`
}

type DriveVariables struct {
	Name string `json:"name"`
	Size int    `json:"size"`
}

func fetchDriveFiles(workflow models.Workflow, body []byte) (bool, []interface{}, error) {
	var driveResp DriveResponse
	callReaction := false
	var interfaces []interface{}
	if err := json.Unmarshal(body, &driveResp); err != nil {
		fmt.Println("Error unmarshalling drive response:", err)
		return false, nil, nil
	}

	if len(driveResp.Value) == 0 {
		return false, nil, nil
	}

	for _, file := range driveResp.Value {
		parsedTime, err := time.Parse(time.RFC3339, file.CreatedDateTime)
		if err != nil {
			fmt.Println("Error parsing CreatedDateTime:", err)
			continue
		}
		if parsedTime.Unix() > workflow.LastTrigger {
			callReaction = true
			driveVar := DriveVariables{
				Name: file.Name,
				Size: file.Size,
			}
			interfaces = append(interfaces, driveVar)
		}
	}

	return callReaction, interfaces, nil
}

func DriveFileAdded(workflow models.Workflow, user *models.User, args map[string]string) (bool, []interface{}, error) {
	var token models.Token
	err := pkg.DB.Where("user_id = ? AND service_id = ?", user.ID, serviceId).First(&token).Error
	if err != nil {
		fmt.Println("Error fetching token from DB:", err)
		return false, nil, nil
	}
	reqURL := "https://graph.microsoft.com/v1.0/me/drive/root/children?$orderby=createdDateTime%20desc&$top=10"
	req, err := http.NewRequest("GET", reqURL, nil)
	if err != nil {
		fmt.Println("Error creating request:", err)
		return false, nil, nil
	}
	req.Header.Set("Authorization", "Bearer "+token.Token)
	req.Header.Set("Content-Type", "application/json")
	resp, err := utils.SendRequest(req)
	if err != nil {
		fmt.Println("Error sending drive request:", err)
		return false, nil, nil
	}
	defer resp.Body.Close()
	if resp.StatusCode == http.StatusUnauthorized {
		oauth.FetchNewToken(&token)
		req.Header.Set("Authorization", "Bearer "+token.Token)
		resp, err = utils.SendRequest(req)
		if err != nil {
			fmt.Println("Error sending drive request after token refresh:", err)
			return false, nil, nil
		}
		defer resp.Body.Close()
	}
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading drive response body:", err)
		return false, nil, nil
	}
	return fetchDriveFiles(workflow, body)
}
