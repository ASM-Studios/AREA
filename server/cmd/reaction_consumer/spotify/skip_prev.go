package spotify

import (
	"AREA/internal/models"
	"AREA/internal/oauth"
	"AREA/internal/pkg"
	"net/http"
)

func SkipPrev(user *models.User, args map[string]string) {
        var token models.Token
        pkg.DB.Where("user_id = ? AND service_id = ?", user.ID, 5).First(&token)

        req, err := http.NewRequest("POST", "https://api.spotify.com/v1/me/player/previous", nil)
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
