package spotify

import (
	"AREA/internal/gconsts"
	"AREA/internal/models"
	"AREA/internal/oauth"
	"AREA/internal/pkg"
	"AREA/internal/utils"
	"bytes"
	_ "bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
)

type SpotifyPlaylists struct {
        Items   []struct {
                Name    string  `json:"name"`
                ID      string  `json:"id"`
        }       `json:"items"`
}

func getPlaylistID(token *models.Token, args map[string]string) string {
        req, err := http.NewRequest("GET", "https://api.spotify.com/v1/me/playlists", nil)
        if err != nil {
                return ""
        }
        req.Header.Set("Authorization", "Bearer " + token.Token)

        resp, err := oauth.SendRequest(token, req)
        if err != nil {
                return ""
        }
        defer resp.Body.Close()
        if resp.StatusCode != 200 {
                return ""
        }
        result, err := utils.ExtractBody[SpotifyPlaylists](resp)
        for _, playlist := range result.Items {
                if playlist.Name == args["playlist_name"] {
                        return playlist.ID
                }
        }
        return ""
}

func addPlaylistItem(args map[string]string) []byte {
        var body struct {
                URIs            []string        `json:"uris"`
                Position        int             `json:"position"`
        }
        body.URIs = append(body.URIs, fmt.Sprintf("spotify:track:%s", args["track_id"]))
        if len(args["position"]) > 0 {
                position, err := strconv.Atoi(args["posiution"])
                if err != nil {
                        body.Position = 0
                } else {
                        body.Position = position
                }
        }
        bodyBytes, _  := json.Marshal(body)
        return bodyBytes
}

func AddTrack(user *models.User, args map[string]string) {
        var token models.Token
        pkg.DB.Where("user_id = ? AND service_id = ?", user.ID, gconsts.ServiceMap["spotify"]).First(&token)

        playlistID := getPlaylistID(&token, args)
        if len(playlistID) == 0 {
                return
        }
        body := addPlaylistItem(args)
        req, err := http.NewRequest("POST", fmt.Sprintf("https://api.spotify.com/v1/playlists/%s/tracks", playlistID), bytes.NewBuffer(body))
        if err != nil {
                return
        }
        req.Header.Set("Authorization", "Bearer " + token.Token)
        req.Header.Set("Content-Type", "application/json")

        resp, err := oauth.SendRequest(&token, req)
        if err != nil {
                return
        }
        defer resp.Body.Close()
}
