package microsoft

import (
	"AREA/internal/models"
	"AREA/internal/oauth"
	"AREA/internal/pkg"
	"fmt"
	"github.com/goccy/go-json"
	"io"
	"log"
	"net/http"
	"time"
)

type Meeting struct {
	ID      string `json:"id"`
	Subject string `json:"subject"`
	Start   struct {
		DateTime string `json:"dateTime"`
	} `json:"start"`
	End struct {
		DateTime string `json:"dateTime"`
	}
	JoinWebUrl string `json:"joinWebUrl"`
}

type MeetingsResponse struct {
	Value []Meeting `json:"value"`
}

type MeetingDetails struct {
	MeetingID      string `json:"meeting_id"`
	MeetingSubject string `json:"meeting_subject"`
	StartTime      string `json:"start_time"`
	JoinWebURL     string `json:"join_web_url"`
}

func fetchMeetings(token models.Token) ([]Meeting, error) {
	url := "https://graph.microsoft.com/v1.0/me/events"

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Printf("Error creating request: %v\n", err)
		return nil, err
	}

	req.Header.Set("Authorization", "Bearer "+token.Token)
	req.Header.Set("Content-Type", "application/json")

	resp, err := oauth.SendRequest(&token, req)
	if err != nil {
		return nil, fmt.Errorf("error sending request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		log.Printf("Error response body: %s\n", string(body))
		return nil, fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("error reading response body: %w", err)
	}

	var eventsResponse struct {
		Value []struct {
			ID      string `json:"id"`
			Subject string `json:"subject"`
			Start   struct {
				DateTime string `json:"dateTime"`
			} `json:"start"`
			End struct {
				DateTime string `json:"dateTime"`
			} `json:"end"`
			IsOnlineMeeting bool `json:"isOnlineMeeting"`
			OnlineMeeting   struct {
				JoinUrl string `json:"joinUrl"`
			} `json:"onlineMeeting"`
		} `json:"value"`
	}

	if err := json.Unmarshal(body, &eventsResponse); err != nil {
		return nil, fmt.Errorf("error unmarshalling response: %w", err)
	}

	var meetings []Meeting
	for _, event := range eventsResponse.Value {
		if event.IsOnlineMeeting {
			meetings = append(meetings, Meeting{
				ID:         event.ID,
				Subject:    event.Subject,
				Start:      event.Start,
				JoinWebUrl: event.OnlineMeeting.JoinUrl,
				End:        event.End,
			})
		}
	}

	log.Printf("Fetched Meetings: %+v\n", meetings)
	return meetings, nil
}

func MeetingJoined(workflow *models.Workflow, user *models.User, _ map[string]string) (bool, []interface{}, error) {
	var interfaces []interface{}
	var token models.Token
	err := pkg.DB.Where("user_id = ? AND service_id = ?", user.ID, serviceId).First(&token).Error
	if err != nil {
		fmt.Println("Error fetching token from DB:", err)
		return false, nil, err
	}

	meetings, err := fetchMeetings(token)
	if err != nil {
		fmt.Println("Error fetching meetings:", err)
		return false, nil, err
	}

	presence, err := fetchPresence(token)
	if err != nil {
		fmt.Println("Error fetching presence:", err)
		return false, nil, err
	}

	callReaction := false
	actualTime := time.Now().Unix()
	for _, meeting := range meetings {
		const customLayout = "2006-01-02T15:04:05.0000000"
		StartparsedTime, startErr := time.Parse(customLayout, meeting.Start.DateTime)
		EndparsedTime, endErr := time.Parse(customLayout, meeting.End.DateTime)

		if startErr != nil {
			log.Printf("Error parsing Start.DateTime for meeting %s: %v", meeting.Subject, startErr)
			continue
		}
		if endErr != nil {
			log.Printf("Error parsing End.DateTime for meeting %s: %v", meeting.Subject, endErr)
			continue
		}
		log.Printf("Meeting: %s, Start Time: %d, End Time: %d,  Actual Time: %d",
			meeting.Subject, StartparsedTime.Unix(), EndparsedTime.Unix(), actualTime)

		log.Printf("Presence Activity: %s", presence.Activity)

		if actualTime >= StartparsedTime.Unix() && actualTime <= EndparsedTime.Unix() {
			if presence.Activity == "InACall" || presence.Activity == "InAMeeting" {
				callReaction = true
				interfaces = append(interfaces, MeetingDetails{
					MeetingID:      meeting.ID,
					MeetingSubject: meeting.Subject,
					StartTime:      meeting.Start.DateTime,
					JoinWebURL:     meeting.JoinWebUrl,
				})
			} else {
				log.Printf("Presence status did not match 'InACall' or 'InAMeeting'")
			}
		} else {
			log.Printf("Meeting conditions not satisfied for: %s", meeting.Subject)
		}
	}
	log.Printf("Interfaces: %+v\n", interfaces)
	return callReaction, interfaces, nil
}
