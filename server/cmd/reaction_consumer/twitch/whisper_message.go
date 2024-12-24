package twitch

import (
	"AREA/internal/models"
	"AREA/internal/pkg"
	"AREA/internal/utils"
	"bytes"
	"fmt"
	"net/http"
	"net/url"
)

func WhisperMessage(user *models.User, args []string) {
        var token models.Token
        pkg.DB.Where("user_id = ? AND service_id = ?", user.ID, 6).First(&token)

        broadcaster_id := getTwitchBroadcasterId(token, user, args[0])
        sender_id := getTwitchSenderId(token, user)
        if broadcaster_id == -1 || sender_id == -1 {
                return
        }

        values := url.Values{}
        values.Set("to_user_id", fmt.Sprintf("%d", broadcaster_id))
        values.Set("from_user_id", fmt.Sprintf("%d", sender_id))
        values.Set("message", args[1])

        req, err := http.NewRequest("POST", "https://api.twitch.tv/helix/whispers", bytes.NewBufferString(values.Encode()))
        if err != nil {
                return
        }

        req.Header.Set("Authorization", "Bearer " + token.Token)
        req.Header.Set("Client-ID", utils.GetEnvVar("TWITCH_CLIENT_ID"))
        req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
        _, err = utils.SendRequest(req)
}
