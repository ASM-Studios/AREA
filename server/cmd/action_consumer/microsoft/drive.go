package microsoft

import (
	"AREA/internal/models"
	"AREA/internal/oauth"
	"AREA/internal/pkg"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

type DriveResponse struct {
	Value []struct {
		ID                   string `json:"id"`
		Name                 string `json:"name"`
		CreatedDateTime      string `json:"createdDateTime"`
		LastModifiedDateTime string `json:"lastModifiedDateTime"`
		ParentReference      struct {
			Path string `json:"path"`
		} `json:"parentReference"`
		LastModifiedBy struct {
			User struct {
				DisplayName string `json:"displayName"`
			} `json:"user"`
		} `json:"lastModifiedBy"`
	} `json:"value"`
}

type DriveVariables struct {
	FileName   string `json:"file_name"`
	FilePath   string `json:"file_path"`
	ModifiedBy string `json:"modified_by"`
}

func fetchDriveFiles(workflow *models.Workflow, body []byte, checkModification bool) (bool, []interface{}, error) {
	var driveResp DriveResponse
	callReaction := false
	var interfaces []interface{}
	if err := json.Unmarshal(body, &driveResp); err != nil {
		fmt.Println("Error unmarshalling drive response:", err)
		return false, nil, err
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
		if !checkModification && parsedTime.Unix() > workflow.LastTrigger {
			callReaction = true
			driveVar := DriveVariables{
				FileName:   file.Name,
				FilePath:   file.ParentReference.Path,
				ModifiedBy: file.LastModifiedBy.User.DisplayName,
			}
			interfaces = append(interfaces, driveVar)
		}

		if checkModification {
			modifiedTime, err := time.Parse(time.RFC3339, file.LastModifiedDateTime)
			if err != nil {
				fmt.Println("Error parsing LastModifiedDateTime:", err)
				continue
			}
			if modifiedTime.Unix() > workflow.LastTrigger {
				callReaction = true
				driveVar := DriveVariables{
					FileName:   file.Name,
					FilePath:   file.ParentReference.Path,
					ModifiedBy: file.LastModifiedBy.User.DisplayName,
				}
				interfaces = append(interfaces, driveVar)
			}
		}
	}

	return callReaction, interfaces, nil
}

func DriveFileAdded(workflow *models.Workflow, user *models.User, args map[string]string) (bool, []interface{}, error) {
	var token models.Token
	err := pkg.DB.Where("user_id = ? AND service_id = ?", user.ID, serviceId).First(&token).Error
	if err != nil {
		fmt.Println("Error fetching token from DB:", err)
		return false, nil, nil
	}

	folderPath := args["folder_path"]
	reqURL := fmt.Sprintf("https://graph.microsoft.com/v1.0/me/drive/root:/%s:/children?$orderby=createdDateTime%20desc&$top=10", folderPath)
	req, err := http.NewRequest("GET", reqURL, nil)
	if err != nil {
		fmt.Println("Error creating request:", err)
		return false, nil, nil
	}
	req.Header.Set("Authorization", "Bearer "+token.Token)
	req.Header.Set("Content-Type", "application/json")
	resp, err := oauth.SendRequest(&token, req)
	if err != nil {
		fmt.Println("Error sending drive request:", err)
		return false, nil, nil
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading drive response body:", err)
		return false, nil, nil
	}
	return fetchDriveFiles(workflow, body, false)
}

func DriveFileModified(workflow *models.Workflow, user *models.User, args map[string]string) (bool, []interface{}, error) {
	var token models.Token
	err := pkg.DB.Where("user_id = ? AND service_id = ?", user.ID, serviceId).First(&token).Error
	if err != nil {
		fmt.Println("Error fetching token from DB:", err)
		return false, nil, nil
	}

	folderPath := args["folder_path"]
	reqURL := fmt.Sprintf("https://graph.microsoft.com/v1.0/me/drive/root:/%s:/children?$orderby=lastModifiedDateTime%20desc&$top=10", folderPath)
	req, err := http.NewRequest("GET", reqURL, nil)
	if err != nil {
		fmt.Println("Error creating request:", err)
		return false, nil, nil
	}
	req.Header.Set("Authorization", "Bearer "+token.Token)
	req.Header.Set("Content-Type", "application/json")
	resp, err := oauth.SendRequest(&token, req)
	if err != nil {
		fmt.Println("Error sending drive request:", err)
		return false, nil, nil
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading drive response body:", err)
		return false, nil, nil
	}
	return fetchDriveFiles(workflow, body, true)
}
