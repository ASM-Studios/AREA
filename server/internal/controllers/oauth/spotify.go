package oauth

import (
	"AREA/internal/models"
	"AREA/internal/pkg"
	"AREA/internal/utils"
	"bytes"
	"encoding/base64"
	"net/http"
	"net/url"

	"github.com/gin-gonic/gin"
)

type SpotifyCode struct {
        Code    string  `json:"code"`
        CodeVerifier string `json:"code_verifier"`
        RedirectUri string `json:"redirect_uri"`
}

type SpotifyToken struct {
        Token   string  `json:"access_token"`
}

type SpotifyResponse struct {
        Mail string `json:"email"`
        DisplayName string `json:"display_name"`
}

func getSpofityBasicAuthorization() string {
        clientID := utils.GetEnvVar("SPOTIFY_CLIENT_ID")
        clientSecret := utils.GetEnvVar("SPOTIFY_CLIENT_SECRET")
        return base64.StdEncoding.EncodeToString([]byte(clientID + ":" + clientSecret))
}

func spotifyGetToken(c *gin.Context, spotifyCode SpotifyCode) (*SpotifyToken) {
        form := url.Values{}
        form.Add("grant_type", "authorization_code")
        form.Add("code", spotifyCode.Code)
        form.Add("code_verifier", spotifyCode.CodeVerifier)
        form.Add("redirect_uri", spotifyCode.RedirectUri)
        req, err := http.NewRequest("POST","https://accounts.spotify.com/api/token" , bytes.NewBufferString(form.Encode()))
        if err != nil {
                return nil
        }
        req.Header.Set("Authorization", "Basic " + getSpofityBasicAuthorization())
        req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

        _, spotifyToken, err := utils.SendRequest[SpotifyToken](req)
        return spotifyToken
}

func createSpotifyToken(c *gin.Context, serviceId uint, spotifyToken SpotifyToken) (*models.Token, error) {
        var dbToken models.Token

        req, err := http.NewRequest("GET", "https://api.spotify.com/v1/me", nil)
        if err != nil {
                return nil, err
        }
        req.Header.Set("Authorization", "Bearer " + spotifyToken.Token)
        _, spotifyResponse, err := utils.SendRequest[SpotifyResponse](req)
        if err != nil {
                return nil, err
        }

        dbToken.Value = spotifyToken.Token
        dbToken.DisplayName = spotifyResponse.DisplayName
        dbToken.Email = spotifyResponse.Mail
        dbToken.ServiceID = serviceId
        return &dbToken, nil
}

func SpotifyCallback(c *gin.Context) (*models.Token, error) {
        serviceId, err := pkg.GetServiceFromName(c.Param("service"))
        if err != nil {
                c.AbortWithStatusJSON(http.StatusBadRequest, gin.H {
                        "message": "Service not found",
                })
                return nil, err
        }

        var spotifyCode SpotifyCode
        if err := c.ShouldBindJSON(&spotifyCode); err != nil {
                c.AbortWithStatusJSON(http.StatusBadRequest, gin.H {
                        "message": "Invalid request",
                })
                return nil, err
        }
        spotifyToken := spotifyGetToken(c, spotifyCode)
        return createSpotifyToken(c, serviceId, *spotifyToken)
}
