package twitch

import (
	"AREA/internal/models"
	"AREA/internal/pkg"
	"AREA/internal/utils"
	"bytes"
	"fmt"
	"net/http"
	"net/url"
	"strconv"
)

type TwitchUserId struct {
        Data    []struct {
                ID      string    `json:"id"`
        }       `json:"data"`
}

func getTwitchSenderId(token models.Token, user *models.User) (int) {
        url := fmt.Sprintf("https://api.twitch.tv/helix/users")
        req, err := http.NewRequest("GET", url, nil)
        if err != nil {
                return -1
        }
        req.Header.Set("Authorization", "Bearer " + token.Token)
        req.Header.Set("Client-ID", utils.GetEnvVar("TWITCH_CLIENT_ID"))
        req.Header.Set("Content-Type", "application/json")

        _, body, err := utils.SendRequestBody[TwitchUserId](req)
        if len(body.Data) == 0 {
                return -1
        }
        id, err := strconv.Atoi(body.Data[0].ID)
        return id
}

func getTwitchBroadcasterId(token models.Token, user *models.User, username string) (int) {
        url := fmt.Sprintf("https://api.twitch.tv/helix/users?login=%s", username)
        req, err := http.NewRequest("GET", url, nil)
        if err != nil {
                return -1
        }
        req.Header.Set("Authorization", "Bearer " + token.Token)
        req.Header.Set("Client-ID", utils.GetEnvVar("TWITCH_CLIENT_ID"))
        req.Header.Set("Content-Type", "application/json")


        _, body, err := utils.SendRequestBody[TwitchUserId](req)
        if len(body.Data) == 0 {
                return -1
        }
        id, err := strconv.Atoi(body.Data[0].ID)
        return id
}

func SendMessage(user *models.User, args []string) {
        var token models.Token
        pkg.DB.Where("user_id = ? AND service_id = ?", user.ID, 6).First(&token)

        broadcaster_id := getTwitchBroadcasterId(token, user, args[0])
        sender_id := getTwitchSenderId(token, user)
        if broadcaster_id == -1 || sender_id == -1 {
                return
        }

        values := url.Values{}
        values.Set("broadcaster_id", fmt.Sprintf("%d", broadcaster_id))
        values.Set("sender_id", fmt.Sprintf("%d", sender_id))
        values.Set("message", args[1])

        req, err := http.NewRequest("POST", "https://api.twitch.tv/helix/chat/messages", bytes.NewBufferString(values.Encode()))
        if err != nil {
                return
        }

        req.Header.Set("Authorization", "Bearer " + token.Token)
        req.Header.Set("Client-ID", utils.GetEnvVar("TWITCH_CLIENT_ID"))
        req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
        _, err = utils.SendRequest(req)
}
