package microsoft

import (
	"AREA/internal/models"
	"AREA/internal/oauth"
	"AREA/internal/pkg"
	"fmt"
	"github.com/goccy/go-json"
	"io"
	"net/http"
	"time"
)

type ChannelDetails struct {
	ID              string `json:"id"`
	DisplayName     string `json:"displayName"`
	CreatedDateTime string `json:"createdDateTime"`
}

func getWhenAChannelIsCreated(token models.Token, workflow *models.Workflow) (bool, []interface{}, error) {
	teamsEndpoint := "https://graph.microsoft.com/v1.0/me/joinedTeams"
	req, _ := http.NewRequest("GET", teamsEndpoint, nil)
	req.Header.Set("Authorization", "Bearer "+token.Token)
	req.Header.Set("Content-Type", "application/json")
	resp, err := oauth.SendRequest(&token, req)
	if err != nil {
		return false, nil, fmt.Errorf("error fetching teams: %w", err)
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

	callReaction := false
	var interfaces []interface{}

	for _, team := range teamsResponse.Value {
		channelsEndpoint := fmt.Sprintf("https://graph.microsoft.com/v1.0/teams/%s/channels", team.ID)
		req, _ := http.NewRequest("GET", channelsEndpoint, nil)
		req.Header.Set("Authorization", "Bearer "+token.Token)
		req.Header.Set("Content-Type", "application/json")
		resp, err = oauth.SendRequest(&token, req)
		if err != nil {
			fmt.Println("Error fetching channels for team:", team.DisplayName, err)
			continue
		}
		defer resp.Body.Close()

		var channelsResponse struct {
			Value []ChannelDetails `json:"value"`
		}
		body, _ := io.ReadAll(resp.Body)
		json.Unmarshal(body, &channelsResponse)

		for _, channel := range channelsResponse.Value {
			parsedTime, err := time.Parse(time.RFC3339, channel.CreatedDateTime)
			if err != nil {
				fmt.Println("Error parsing CreatedDateTime for channel:", channel.ID, err)
				continue
			}

			if parsedTime.Unix() > workflow.LastTrigger {
				var channelInfo = map[string]interface{}{
					"teams_name":   team.DisplayName,
					"channel_name": channel.DisplayName,
					"channel_id":   channel.ID,
					"created_time": channel.CreatedDateTime,
				}
				callReaction = true
				interfaces = append(interfaces, channelInfo)
			}
		}
	}

	return callReaction, interfaces, nil
}

func NewChannelCreated(workflow *models.Workflow, user *models.User, _ map[string]string) (bool, []interface{}, error) {
	fmt.Println("NewChannelCreated")
	var token models.Token
	err := pkg.DB.Where("user_id = ? AND service_id = ?", user.ID, serviceId).
		First(&token).Error
	if err != nil {
		fmt.Println("Error fetching token from DB:", err)
		return false, nil, nil
	}
	return getWhenAChannelIsCreated(token, workflow)
}
