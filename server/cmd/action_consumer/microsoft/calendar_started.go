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

type MicrosoftEvent struct {
	Subject         string `json:"subject"`
	CreatedDateTime string `json:"createdDateTime"`
	Start           struct {
		DateTime string `json:"dateTime"`
		TimeZone string `json:"timeZone"`
	} `json:"start"`
	Organizer struct {
		EmailAddress struct {
			Address string `json:"address"`
		} `json:"emailAddress"`
	} `json:"organizer"`
	Location struct {
		DisplayName string `json:"displayName"`
	}
}

type MicrosoftEventsResponse struct {
	Value []MicrosoftEvent `json:"value"`
}

type CalendarValue struct {
	Subject   string `json:"subject"`
	Organizer string `json:"organizer"`
	Location  string `json:"location"`
}

func hasEventStarted(workflow *models.Workflow, body []byte) (bool, []interface{}, error) {
	var eventsResp MicrosoftEventsResponse
	callReaction := false
	var interfaces []interface{}
	if err := json.Unmarshal(body, &eventsResp); err != nil {
		fmt.Println("Error unmarshalling events response:", err)
		return callReaction, nil, nil
	}

	if len(eventsResp.Value) == 0 {
		return callReaction, nil, nil
	}

	now := time.Now()

	for _, ev := range eventsResp.Value {
		startTime, err := time.Parse(time.RFC3339, ev.Start.DateTime)
		if err != nil {
			fmt.Println("Error parsing start.DateTime for event:", ev.Subject, err)
			continue
		}
		if startTime.Unix() > workflow.LastTrigger && startTime.Before(now) {
			fmt.Printf("Detected started event: %s (start: %s)\n", ev.Subject, startTime)
			var calandarVar = CalendarValue{
				Subject:   ev.Subject,
				Organizer: ev.Organizer.EmailAddress.Address,
				Location:  ev.Location.DisplayName,
			}
			callReaction = true
			interfaces = append(interfaces, calandarVar)
		}
	}
	return callReaction, nil, nil
}

func CalendarEventStarted(workflow *models.Workflow, user *models.User, _ map[string]string) (bool, []interface{}, error) {
	var token models.Token
	err := pkg.DB.Where("user_id = ? AND service_id = ?", user.ID, serviceId).First(&token).Error
	if err != nil {
		fmt.Println("Error fetching token from DB:", err)
		return false, nil, nil
	}

	reqURL := "https://graph.microsoft.com/v1.0/me/events?$orderby=start/dateTime%20desc&$top=10"

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
		fmt.Println("Error reading response body:", err)
		return false, nil, nil
	}
	return hasEventStarted(workflow, body)
}
