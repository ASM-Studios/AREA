package microsoft

import (
	"AREA/internal/models"
	"AREA/internal/oauth"
	"AREA/internal/pkg"
	"bytes"
	"github.com/goccy/go-json"
	"github.com/rs/zerolog/log"
	"io"
	"net/http"
	"strings"
)

type DateEvent struct {
	DateTime string `json:"dateTime"`
	TimeZone string `json:"timeZone"`
}

type LocationEvent struct {
	DisplayName string `json:"displayName"`
}

type Attendee struct {
	EmailAddress struct {
		Address string `json:"address"`
		Name    string `json:"name"`
	} `json:"emailAddress"`
	Type string `json:"type"`
}

type EventPayload struct {
	Subject   string        `json:"subject"`
	Start     DateEvent     `json:"start"`
	End       DateEvent     `json:"end"`
	Location  LocationEvent `json:"location"`
	Attendees []Attendee    `json:"attendees"`
}

func parseAttendees(attendees string) []Attendee {
	emails := strings.Split(attendees, ",")
	attendeeList := make([]Attendee, 0, len(emails))
	for _, email := range emails {
		attendeeList = append(attendeeList, Attendee{
			EmailAddress: struct {
				Address string `json:"address"`
				Name    string `json:"name"`
			}{
				Address: strings.TrimSpace(email),
				Name:    strings.TrimSpace(email),
			},
			Type: "required",
		})
	}
	return attendeeList
}

func createEventRequest(args map[string]string) []byte {
	event := EventPayload{
		Subject: args["subject"],
		Start: DateEvent{
			DateTime: args["start_time"],
			TimeZone: "UTC",
		},
		End: DateEvent{
			DateTime: args["end_time"],
			TimeZone: "UTC",
		},
		Location: LocationEvent{
			DisplayName: args["location"],
		},
		Attendees: parseAttendees(args["attendees"]),
	}

	body, err := json.Marshal(event)
	if err != nil {
		log.Error().Err(err).Msg("Failed to marshal event request")
	}
	return body
}

func CreateEvent(user *models.User, args map[string]string) {
	var token models.Token
	pkg.DB.Where("user_id = ? AND service_id = ?", user.ID, serviceId).First(&token)
	log.Print("args: ", args)
	body := createEventRequest(args)

	reqURL := "https://graph.microsoft.com/v1.0/me/events"
	req, err := http.NewRequest("POST", reqURL, bytes.NewBuffer(body))
	if err != nil {
		log.Error().Err(err).Msg("Error creating request")
		return
	}
	req.Header.Set("Authorization", "Bearer "+token.Token)
	req.Header.Set("Content-Type", "application/json")

	resp, err := oauth.SendRequest(&token, req)
	if err != nil {
		log.Error().Err(err).Msg("Error sending mail request")
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		bodyBytes, _ := io.ReadAll(resp.Body)
		log.Error().Int("status_code", resp.StatusCode).
			Str("response_body", string(bodyBytes)).
			Msg("Failed to create event")
	} else {
		log.Info().Msg("Event created successfully")
	}
}
