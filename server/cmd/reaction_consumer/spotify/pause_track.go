package spotify

import (
        "AREA/internal/models"
        "AREA/internal/oauth"
        "AREA/internal/pkg"
        "AREA/internal/utils"
        "net/http"
)

type SpotifyPlayback struct {
        IsPlaying       bool    `json:"is_playing"`
}

func PauseTrack(user *models.User, token *models.Token, args map[string]string) {
        req, err := http.NewRequest("PUT", "https://api.spotify.com/v1/me/player/pause", nil)
        if err != nil {
                return
        }
        req.Header.Set("Authorization", "Bearer " + token.Token)

        resp, err := oauth.SendRequest(token, req)
        defer resp.Body.Close()
}

func ResumeTrack(user *models.User, token *models.Token, args map[string]string) {
        req, err := http.NewRequest("PUT", "https://api.spotify.com/v1/me/player/play", nil)
        if err != nil {
                return
        }
        req.Header.Set("Authorization", "Bearer " + token.Token)

        resp, err := oauth.SendRequest(token, req)
        defer resp.Body.Close()
}

func PlayPauseTrack(user *models.User, args map[string]string) {
        var token models.Token
        pkg.DB.Where("user_id = ? AND service_id = ?", user.ID, 5).First(&token)

        req, err := http.NewRequest("GET", "https://api.spotify.com/v1/me/player", nil)
        if err != nil {
                return
        }
        req.Header.Set("Authorization", "Bearer " + token.Token)

        resp, err := oauth.SendRequest(&token, req)
        if err != nil {
                return
        }
        defer resp.Body.Close()
        if resp.StatusCode != 200 {
                return
        }
        result, err := utils.ExtractBody[SpotifyPlayback](resp)
        if result.IsPlaying == true {
                PauseTrack(user, &token, args)
        } else {
                ResumeTrack(user, &token, args)
        }
}
