package oauth

import (
	"AREA/internal/models"
	"AREA/internal/pkg"
	"AREA/internal/utils"
	"bytes"
	"net/http"
	"net/url"

	"github.com/gin-gonic/gin"
)

type TwitchCode struct {
        Code            string  `json:"code"`
        RedirectUri     string  `json:"redirect_uri"`
}

type TwitchToken struct {
        Token           string  `json:"access_token"`
        RefreshToken    string  `json:"refresh_token"`
        ExpiresIn       int     `json:"expires_in"`
}

type TwitchResponse struct {
        Data []struct {
                Mail            string  `json:"email"`
                DisplayName     string  `json:"display_name"`
        }
}

func getTwitchBearer(c *gin.Context, twitchCode TwitchCode) (*TwitchToken, error) {
        form := url.Values{}
        form.Add("grant_type", "authorization_code")
        form.Add("code", twitchCode.Code)
        form.Add("redirect_uri", twitchCode.RedirectUri)
        form.Add("client_id", utils.GetEnvVar("TWITCH_CLIENT_ID"))
        form.Add("client_secret", utils.GetEnvVar("TWITCH_CLIENT_SECRET"))

        req, err := http.NewRequest("POST", "https://id.twitch.tv/oauth2/token" , bytes.NewBufferString(form.Encode()))
        if err != nil {
                return nil, err
        }

        resp, twitchToken, err := utils.SendRequest[TwitchToken](req)
        if err != nil || resp.StatusCode != 200 {
                return nil, nil
        }

        return twitchToken, nil
}

func createTwitchToken(c *gin.Context, serviceId uint, twitchToken TwitchToken) (*models.Token, error) {
        var dbToken models.Token

        req, err := http.NewRequest("GET", "https://api.twitch.tv/helix/users", nil)
        if err != nil {
                return nil, err
        }

        req.Header.Set("Authorization", "Bearer " + twitchToken.Token)
        req.Header.Set("Client-ID", utils.GetEnvVar("TWITCH_CLIENT_ID"))

        _, twitchResponse, err := utils.SendRequest[TwitchResponse](req)
        if err != nil {
                return nil, err
        }

        dbToken.Token = twitchToken.Token
        dbToken.RefreshToken = twitchToken.RefreshToken
        dbToken.ExpiresIn = twitchToken.ExpiresIn
        dbToken.Email = twitchResponse.Data[0].Mail
        dbToken.DisplayName = twitchResponse.Data[0].DisplayName
        dbToken.ServiceID = serviceId
        return &dbToken, nil
}

func TwitchCallback(c *gin.Context) (*models.Token, error) {
        serviceId, err := pkg.GetServiceFromName(c.Param("service"))
        if err != nil {
                c.AbortWithStatusJSON(http.StatusBadRequest, gin.H {
                        "message": "Service not found",
                })
                return nil, err
        }

        var twitchCode TwitchCode
        if err := c.ShouldBindJSON(&twitchCode); err != nil {
                c.AbortWithStatusJSON(http.StatusBadRequest, gin.H {
                        "message": "Invalid request",
                })
                return nil, err
        }
        bearerToken, err := getTwitchBearer(c, twitchCode)
        if err != nil {
                c.AbortWithStatusJSON(http.StatusBadRequest, gin.H {
                        "message": "Invalid request",
                })
                return nil, err
        }
        return createTwitchToken(c, serviceId, *bearerToken)
}
