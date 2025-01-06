package spotify

import (
	"AREA/cmd/action_consumer/vars"
	"AREA/internal/models"
	"AREA/internal/oauth"
	"AREA/internal/pkg"
	"AREA/internal/utils"
	"net/http"
)

type TrackInfo struct {
        Timestamp       int64   `json:"timestamp"`
        Item    struct {
                Id      string  `json:"id"`
        }       `json:"item"`
}

func StartPlaying(user *models.User, args map[string]string) bool {
        var token models.Token
        pkg.DB.Where("user_id = ? AND service_id = ?", user.ID, 5).First(&token)

        req, err := http.NewRequest("GET", "https://api.spotify.com/v1/me/player", nil)
        if err != nil {
                return false
        }
        req.Header.Set("Authorization", "Bearer " + token.Token)
        
        resp, err := oauth.SendRequest(&token, req)
        if err != nil {
                return false
        }
        defer resp.Body.Close()
        if resp.StatusCode != 200 {
                return false
        }

        result, err := utils.ExtractBody[TrackInfo](resp)
        if (result.Timestamp / 1000) > vars.LastFetch {
                if len(args["track_id"]) > 0 {
                        return result.Item.Id == args["track_id"]
                }
                return true;
        } else {
                return false;
        }
}
