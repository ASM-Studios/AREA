package microsoft

import (
	"AREA/cmd/action_consumer/vars"
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

type TeamsMessage struct {
	ID               string `json:"id"`
	CreatedDateTime  string `json:"createdDateTime"`
	FriendlyFromName string `json:"from"`
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

func NewMessageInChannel(user *models.User, args []string) bool {
	if len(args) < 2 {
		fmt.Println("Error: NewMessageInChannel requires at least two parameters (TEAM_ID, CHANNEL_ID).")
		return false
	}
	teamID := args[0]
	channelID := args[1]
	var token models.Token
	err := pkg.DB.Where("user_id = ? AND service_id = ?", user.ID, serviceId).
		First(&token).Error
	if err != nil {
		fmt.Println("Error fetching token from DB:", err)
		return false
	}
	endpoint := fmt.Sprintf("https://graph.microsoft.com/v1.0/teams/%s/channels/%s/messages?$top=15&$orderby=createdDateTime desc",
		teamID, channelID)
	req, err := http.NewRequest("GET", endpoint, nil)
	if err != nil {
		fmt.Println("Error creating Teams message request:", err)
		return false
	}
	req.Header.Set("Authorization", "Bearer "+token.Token)
	req.Header.Set("Content-Type", "application/json")
	resp, err := utils.SendRequest(req)
	if err != nil {
		fmt.Println("Error sending Teams message request:", err)
		return false
	}
	defer resp.Body.Close()
	if resp.StatusCode == http.StatusUnauthorized {
		oauth.FetchNewToken(&token)
		req.Header.Set("Authorization", "Bearer "+token.Token)
		resp, err = utils.SendRequest(req)
		if err != nil {
			fmt.Println("Error sending Teams message request after token refresh:", err)
			return false
		}
		defer resp.Body.Close()
	}
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading Teams messages response body:", err)
		return false
	}
	return hasNewMessagesInChannel(body)
}
