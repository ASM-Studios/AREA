package twitch

import (
	"AREA/internal/models"
	"AREA/internal/oauth"
	"AREA/internal/utils"
	"fmt"
	"net/http"
	"strconv"
)

type TwitchUserId struct {
        Data    []struct {
                ID      string    `json:"id"`
        }       `json:"data"`
}

func getTwitchSenderId(token *models.Token, user *models.User) (int) {
        url := fmt.Sprintf("https://api.twitch.tv/helix/users")
        req, err := http.NewRequest("GET", url, nil)
        if err != nil {
                return -1
        }
        req.Header.Set("Authorization", "Bearer " + token.Token)
        req.Header.Set("Client-ID", utils.GetEnvVar("TWITCH_CLIENT_ID"))
        req.Header.Set("Content-Type", "application/json")

        resp, err := oauth.SendRequest(token, req)
        if err != nil {
                return -1
        }
        defer resp.Body.Close()
        if resp.StatusCode != 200 {
                return -1
        }
        body, err := utils.ExtractBody[TwitchUserId](resp)
        if len(body.Data) == 0 {
                return -1
        }
        id, err := strconv.Atoi(body.Data[0].ID)
        return id
}

func getTwitchBroadcasterId(token *models.Token, user *models.User, username string) (int) {
        url := fmt.Sprintf("https://api.twitch.tv/helix/users?login=%s", username)
        req, err := http.NewRequest("GET", url, nil)
        if err != nil {
                return -1
        }
        req.Header.Set("Authorization", "Bearer " + token.Token)
        req.Header.Set("Client-ID", utils.GetEnvVar("TWITCH_CLIENT_ID"))
        req.Header.Set("Content-Type", "application/json")

        resp, err := oauth.SendRequest(token, req)
        if err != nil {
                return -1
        }
        defer resp.Body.Close()
        if resp.StatusCode != 200 {
                return -1
        }
        body, err := utils.ExtractBody[TwitchUserId](resp)
        if len(body.Data) == 0 {
                return -1
        }
        id, err := strconv.Atoi(body.Data[0].ID)
        return id
}
