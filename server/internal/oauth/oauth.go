package oauth

import (
	"AREA/internal/models"
	"AREA/internal/utils"
	"bytes"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"

	"github.com/gin-gonic/gin"
)

type ServiceApp struct {
        ServiceName     string
        ClientId        string
        ClientSecret    string
        TokenURL        string
        MeURL           string
}

var OAuthApps = map[string]ServiceApp {
        "microsoft": {ServiceName: "microsoft", ClientId: "MICROSOFT_CLIENT_ID", ClientSecret: "MICROSOFT_CLIENT_SECRET",
                TokenURL: "https://login.microsoftonline.com/common/oauth2/v2.0/token", MeURL: "https://graph.microsoft.com/v1.0/me"},
        "github": {ServiceName: "github", ClientId: "GITHUB_CLIENT_ID", ClientSecret: "GITHUB_CLIENT_SECRET",
                TokenURL: "https://github.com/login/oauth/access_token", MeURL: "https://api.github.com/user"},
        "spotify": {ServiceName: "spotify", ClientId: "SPOTIFY_CLIENT_ID", ClientSecret: "SPOTIFY_CLIENT_SECRET",
                TokenURL: "https://accounts.spotify.com/api/token",  MeURL: "https://api.spotify.com/v1/me"},
        "twitch": {ServiceName: "twitch", ClientId: "TWITCH_CLIENT_ID", ClientSecret: "TWITCH_CLIENT_SECRET",
                TokenURL: "https://id.twitch.tv/oauth2/token", MeURL: "https://api.twitch.tv/helix/users"},
        "discord": {ServiceName: "discord", ClientId: "DISCORD_CLIENT_ID", ClientSecret: "DISCORD_CLIENT_SECRET",
                TokenURL: "https://discord.com/api/oauth2/token", MeURL: "https://discord.com/api/users/@me"},
        "google": {ServiceName: "google", ClientId: "GOOGLE_CLIENT_ID", ClientSecret: "GOOGLE_CLIENT_SECRET",
                TokenURL: "https://oauth2.googleapis.com/token", MeURL: "https://www.googleapis.com/oauth2/v1/userinfo"},
}

type ServiceCode struct {
        Code    string  `json:"code"`
        CodeVerifier string `json:"code_verifier"`
        RedirectUri string `json:"redirect_uri"`
}

type ServiceBearerToken struct {
        Token           string  `json:"access_token"`
        RefreshToken    string  `json:"refresh_token"`
}

type ServiceResponse struct {
        Mail string
        DisplayName string
}

type ServiceResponseConverter func(*http.Response) (*ServiceResponse, error)

var ServiceResponseConverters = map[string]ServiceResponseConverter {
        "github": GetGithubResponse,
        "spotify": GetSpotifyResponse,
        "microsoft": GetMicrosoftResponse,
        "twitch": GetTwitchResponse,
        "discord": GetDiscordResponse,
        "google": GetGoogleResponse,
}

func getServiceBearer(serviceApp ServiceApp, serviceCode ServiceCode) (*ServiceBearerToken, error) {
        form := url.Values{}
        form.Add("grant_type", "authorization_code")
        form.Add("code", serviceCode.Code)
        if serviceCode.CodeVerifier != "" {
                form.Add("code_verifier", serviceCode.CodeVerifier)
        }
        form.Add("redirect_uri", serviceCode.RedirectUri)
        form.Add("client_id", utils.GetEnvVar(serviceApp.ClientId))
        form.Add("client_secret", utils.GetEnvVar(serviceApp.ClientSecret))

        req, err := http.NewRequest("POST", serviceApp.TokenURL, bytes.NewBufferString(form.Encode()))
        if err != nil {
                return nil, errors.New("Failed to create request")
        }
        req.Header.Set("Accept", "application/json")
        req.Header.Set("Origin", "http://localhost")
        req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

        resp, err := utils.SendRequest(req)
        if err != nil || resp.StatusCode != 200 {
                fmt.Printf("HERE %d\n", resp.StatusCode)
                b, _ := io.ReadAll(resp.Body)
                fmt.Println(string(b))
                return nil, errors.New("Failed to fetch bearer token")
        }
        serviceBearerToken, err := utils.ExtractBody[ServiceBearerToken](resp)
        return serviceBearerToken, nil
}

func createDBToken(serviceId uint, serviceApp ServiceApp, serviceBearerToken ServiceBearerToken) (*models.Token, error) {
        var dbToken models.Token

        req, err := http.NewRequest("GET", serviceApp.MeURL, nil)
        if err != nil {
                return nil, errors.New("Failed to create request")
        }

        req.Header.Set("Authorization", "Bearer " + serviceBearerToken.Token)
        req.Header.Set("Client-ID", utils.GetEnvVar(serviceApp.ClientId))
        resp, err := utils.SendRequest(req)
        if err != nil || resp.StatusCode != 200 {
                return nil, errors.New("Failed to fetch user info")
        }
        serviceResponse, err := ServiceResponseConverters[serviceApp.ServiceName](resp)

        dbToken.Token = serviceBearerToken.Token
        dbToken.RefreshToken = serviceBearerToken.RefreshToken
        dbToken.DisplayName = serviceResponse.DisplayName
        dbToken.Email = serviceResponse.Mail
        dbToken.ServiceID = serviceId
        return &dbToken, nil
}

func BasicServiceCallback(c *gin.Context, serviceId uint, serviceApp ServiceApp) (*models.Token, error) {
        var serviceCode ServiceCode
        if err := c.ShouldBindJSON(&serviceCode); err != nil {
                fmt.Println("Invalid body")
                return nil, errors.New("Invalid body")
        }

        bearerToken, err := getServiceBearer(serviceApp, serviceCode)
        if err != nil || bearerToken == nil {
                fmt.Println("Failed to fetch jwt")
                return nil, errors.New("Failed to fetch bearer token")
        }

        return createDBToken(serviceId, serviceApp, *bearerToken)
}
