package google

import (
	"AREA/internal/models"
	"AREA/internal/oauth"
	"AREA/internal/pkg"
	"encoding/json"
	"net/http"
)

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

        req, err := http.NewRequest("POST", "https://gmail.googleapis.com/gmail/v1/users/me/messages/send", nil)
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
