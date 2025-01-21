package twitch

import (
	"AREA/internal/gconsts"
	"AREA/internal/models"
	"AREA/internal/oauth"
	"AREA/internal/pkg"
	"AREA/internal/utils"
	"errors"
	"net/http"
	"time"
)

type StreamInfo struct {
        UserLogin       string  `json:"user_login"`
        UserName        string  `json:"user_name"`
        GameName        string  `json:"game_name"`
        Title           string  `json:"title"`
        StartedAt       string  `json:"started_at"`
}

type Streams struct {
        Data    []StreamInfo      `json:"data"`
}

func fetchStreamInfo(workflow *models.Workflow, streamInfo Streams) (bool, []interface{}, error) {
        if len(streamInfo.Data) == 0 {
                return false, nil, nil
        }

        timeParsed, _ := time.Parse(time.RFC3339, streamInfo.Data[0].StartedAt)
        if timeParsed.Unix() > workflow.LastTrigger {
                return true, []interface{}{streamInfo.Data[0]}, nil
        } else {
                return false, nil, nil
        }
}

func StreamStart(workflow *models.Workflow, user *models.User, args map[string]string) (bool, []interface{}, error) {
        var token models.Token
        pkg.DB.Where("user_id = ? AND service_id = ?", user.ID, gconsts.ServiceMap["twitch"]).First(&token)

        req, err := http.NewRequest("GET", "https://api.twitch.tv/helix/streams?user_login=" + args["streamer"], nil)
        if err != nil {
                return false, nil, errors.New("Failed to create request")
        }

        req.Header.Set("Authorization", "Bearer " + token.Token)
        req.Header.Set("Client-ID", utils.GetEnvVar("TWITCH_CLIENT_ID"))

        resp, err := oauth.SendRequest(&token, req)
        if err != nil {
                return false, nil, errors.New("Failed to send request")
        }
        defer resp.Body.Close()
        if resp.StatusCode != 200 {
                return false, nil, errors.New("Failed to fetch streams")
        }

        result, err := utils.ExtractBody[Streams](resp)
        return fetchStreamInfo(workflow, *result)
}
