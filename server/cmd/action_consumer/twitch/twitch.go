package twitch

import (
	"AREA/cmd/action_consumer/vars"
	"AREA/internal/models"
	"AREA/internal/oauth"
	"AREA/internal/pkg"
	"AREA/internal/utils"
	"encoding/json"
	"io"
	"net/http"
	"time"
)

func fetchStreamInfo(body []byte) bool {
        var streamInfo struct {
                Data    []struct {
                        StartedAt       string  `json:"started_at"`
                }       `json:"data"`
        }

        err := json.Unmarshal(body, &streamInfo)
        if err != nil {
                return false
        }

        if len(streamInfo.Data) == 0 {
                return false
        }

        timeParsed, err := time.Parse(time.RFC3339, streamInfo.Data[0].StartedAt)
        if timeParsed.Unix() > vars.LastFetch.Unix() {
                return true
        } else {
                return false
        }
}

func StreamStart(user *models.User, args []string) bool {
        var token models.Token
        pkg.DB.Where("user_id = ? AND service_id = ?", user.ID, 6).First(&token)

        if len(args) != 1 {
                return false
        }
        req, err := http.NewRequest("GET", "https://api.twitch.tv/helix/streams?user_login=" + args[0], nil)
        if err != nil {
                return false
        }

        req.Header.Set("Authorization", "Bearer " + token.Token)
        req.Header.Set("Client-ID", utils.GetEnvVar("TWITCH_CLIENT_ID"))
        resp, err := utils.SendRequest(req)
        if resp.StatusCode == 401 {
                oauth.FetchNewToken(&token)
        }

        resp, err = utils.SendRequest(req)
        defer resp.Body.Close()
        b, err := io.ReadAll(resp.Body)
        return fetchStreamInfo(b)
}
