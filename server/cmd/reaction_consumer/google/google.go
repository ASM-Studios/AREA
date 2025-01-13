package google

import (
	"AREA/internal/models"
	"AREA/internal/oauth"
	"AREA/internal/pkg"
	"AREA/internal/utils"
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

type Calendars struct {
        Items []struct {
                Summary string  `json:"summary"`
                Id      string  `json:"id"`
        } `json:"items"`
}

type EventBody struct {
        Summary string `json:"summary"`
        Description string `json:"description,omitempty"`
        Location string `json:"location,omitempty"`
        Start struct {
                DateTime string `json:"dateTime"`
                TimeZone string `json:"timeZone"`
        } `json:"start"`
        End struct {
                DateTime string `json:"dateTime"`
                TimeZone string `json:"timeZone"`
        } `json:"end"`
}

func getCalendarId(token *models.Token, args map[string]string) string {
        req, err := http.NewRequest("GET", "https://www.googleapis.com/calendar/v3/users/me/calendarList", nil)
        if err != nil {
                return ""
        }
        req.Header.Set("Authorization", "Bearer " + token.Token)

        resp, err := oauth.SendRequest(token, req)
        if err != nil {
                return ""
        }
        defer resp.Body.Close()
        result, err := utils.ExtractBody[Calendars](resp)
        if err != nil {
                return ""
        }
        for _, calendar := range result.Items {
                if calendar.Summary == args["calendar_name"] {
                        return calendar.Id
                }
        }
        return ""
}

func createBody(args map[string]string) []byte {
        var eventBody EventBody

        eventBody.Summary = args["summary"]
        eventBody.Description = args["description"]
        eventBody.Location = args["location"]

        eventBody.Start.DateTime = args["start"]
        eventBody.Start.TimeZone = "Europe/Paris"

        eventBody.End.DateTime = args["end"]
        eventBody.End.TimeZone = "Europe/Paris"

        body, _ := json.Marshal(eventBody)
        return body
}

func AddEvent(user *models.User, args map[string]string) {
        var token models.Token
        pkg.DB.Where("user_id = ? AND service_id = ?", user.ID, 3).First(&token)

        id := getCalendarId(&token, args)
        if id == "" {
                return
        }
        body := createBody(args)
        req, err := http.NewRequest("POST", fmt.Sprintf("https://www.googleapis.com/calendar/v3/calendars/%s/events", id), bytes.NewBuffer(body))
        if err != nil {
                return
        }
        req.Header.Set("Authorization", "Bearer " + token.Token)

        resp, err := oauth.SendRequest(&token, req)
        if err != nil {
                return
        }
        defer resp.Body.Close()
}
