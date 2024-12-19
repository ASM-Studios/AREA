package oauth

import (
	"AREA/internal/models"
	"AREA/internal/utils"
	"bytes"
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
                return nil, err
        }
        req.Header.Set("Accept", "application/json")
        req.Header.Set("Origin", "http://localhost")
        req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

        _, serviceBearerToken, err := utils.SendRequestBody[ServiceBearerToken](req)
        if err != nil {
                return nil, err
        }
        return serviceBearerToken, nil
}

func createDBToken(serviceId uint, serviceApp ServiceApp, serviceBearerToken ServiceBearerToken) (*models.Token, error) {
        var dbToken models.Token

        req, err := http.NewRequest("GET", serviceApp.MeURL, nil)
        if err != nil {
                return nil, err
        }
        req.Header.Set("Authorization", "Bearer " + serviceBearerToken.Token)
        req.Header.Set("Client-ID", utils.GetEnvVar(serviceApp.ClientId))
        resp, err := utils.SendRequest(req)        //TODO CHANGE REQUEST
        if err != nil {
                return nil, err
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
                c.AbortWithStatusJSON(http.StatusBadRequest, gin.H {
                        "message": "Invalid request",
                })
                return nil, err
        }

        bearerToken, err := getServiceBearer(serviceApp, serviceCode)
        if err != nil || bearerToken == nil {
                c.AbortWithStatusJSON(http.StatusBadRequest, gin.H {
                        "message": "Invalid request",
                })
                return nil, err
        }
        res, err := createDBToken(serviceId, serviceApp, *bearerToken)
        return res, err
}
