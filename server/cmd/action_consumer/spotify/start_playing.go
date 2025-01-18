package spotify

import (
	"AREA/internal/gconsts"
	"AREA/internal/models"
	"AREA/internal/oauth"
	"AREA/internal/pkg"
	"AREA/internal/utils"
	"errors"
	"fmt"
	"net/http"
)

type TrackInfo struct {
        Timestamp       int64   `json:"timestamp"`
        IsPlaying       bool    `json:"is_playing"`
        Item    struct {
                Album struct {
                        Name    string  `json:"name"`
                }       `json:"album"`
                Name    string  `json:"name"`
                Id      string  `json:"id"`
        }       `json:"item"`
}

type TrackInfoReturn struct {
        Timestamp       int64   `json:"timestamp"`
        IsPlaying       bool    `json:"is_playing"`
        AlbumName       string  `json:"album_name"`
        Name    string  `json:"name"`
        Id      string  `json:"id"`
}

func StartPlaying(workflow *models.Workflow, user *models.User, args map[string]string) (bool, []interface{}, error) {
        var token models.Token
        pkg.DB.Where("user_id = ? AND service_id = ?", user.ID, gconsts.ServiceMap["spotify"]).First(&token)

        req, err := http.NewRequest("GET", "https://api.spotify.com/v1/me/player", nil)
        if err != nil {
                return false, nil, errors.New("Failed to create request")
        }
        req.Header.Set("Authorization", "Bearer " + token.Token)
        
        resp, err := oauth.SendRequest(&token, req)
        if err != nil {
                return false, nil, errors.New("Failed to send request")
        }
        defer resp.Body.Close()
        if resp.StatusCode != 200 {
                return false, nil, errors.New("Failed to fetch spotify API")
        }

        result, err := utils.ExtractBody[TrackInfo](resp)
        fmt.Printf("> %v - %v\n", result, err)
        trackInfoReturn := TrackInfoReturn{result.Timestamp, result.IsPlaying, result.Item.Album.Name, result.Item.Name, result.Item.Id}
        if result.IsPlaying && (result.Timestamp / 1000) > workflow.LastTrigger {
                return true, []interface{}{trackInfoReturn}, nil;
        } else {
                return false, nil, nil;
        }
}
