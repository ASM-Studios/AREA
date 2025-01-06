package twitch

import (
	"AREA/internal/models"
	"AREA/internal/oauth"
	"AREA/internal/pkg"
	"AREA/internal/utils"
	"net/http"
	"time"
)

type StreamInfo struct {
        Data    []struct {
                StartedAt       string  `json:"started_at"`
        }       `json:"data"`
}

func fetchStreamInfo(workflow *models.Workflow, streamInfo StreamInfo) bool {
        if len(streamInfo.Data) == 0 {
                return false
        }

        timeParsed, _ := time.Parse(time.RFC3339, streamInfo.Data[0].StartedAt)
        if timeParsed.Unix() > workflow.LastTrigger {
                return true
        } else {
                return false
        }
}

func StreamStart(workflow *models.Workflow, user *models.User, args map[string]string) bool {
        var token models.Token
        pkg.DB.Where("user_id = ? AND service_id = ?", user.ID, 6).First(&token)

        req, err := http.NewRequest("GET", "https://api.twitch.tv/helix/streams?user_login=" + args["streamer"], nil)
        if err != nil {
                return false
        }

        req.Header.Set("Authorization", "Bearer " + token.Token)
        req.Header.Set("Client-ID", utils.GetEnvVar("TWITCH_CLIENT_ID"))

        resp, err := oauth.SendRequest(&token, req)
        if err != nil {
                return false
        }
        defer resp.Body.Close()
        if resp.StatusCode != 200 {
                return false
        }

        result, err := utils.ExtractBody[StreamInfo](resp)
        return fetchStreamInfo(workflow, *result)
}
