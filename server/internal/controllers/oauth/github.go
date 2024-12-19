package oauth

import (
	"AREA/internal/models"
	"AREA/internal/pkg"
	"AREA/internal/utils"
	"bytes"
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
)

type GithubCode struct {
        Code    string  `json:"code"`
        CodeVerifier string `json:"code_verifier"`
        RedirectUri string `json:"redirect_uri"`
}

type GithubToken struct {
        Token   string  `json:"access_token"`
}

type GithubResponse struct {
        Mail string `json:"email"`
        DisplayName string `json:"login"`
}

func getGithubBearer(c *gin.Context, githubCode GithubCode) (*GithubToken, error) {
        body := struct {
                Code    string  `json:"code"`
                RedirectUri string `json:"redirect_uri"`
                ClientID string `json:"client_id"`
                ClientSecret string `json:"client_secret"`
        }{
                Code: githubCode.Code,
                RedirectUri: githubCode.RedirectUri,
                ClientID: utils.GetEnvVar("GITHUB_CLIENT_ID"),
                ClientSecret: utils.GetEnvVar("GITHUB_CLIENT_SECRET"),
        }
        encodedBody, err := json.Marshal(body)
        req, err := http.NewRequest("POST", "https://github.com/login/oauth/access_token" , bytes.NewBuffer(encodedBody))
        if err != nil {
                return nil, err
        }
        req.Header.Set("Accept", "application/json")
        req.Header.Set("Content-Type", "application/json")

        resp, githubToken, err := utils.SendRequest[GithubToken](req)
        if err != nil || resp.StatusCode != 200 {
                return nil, err
        }
        return githubToken, nil
}

func createGithubToken(c *gin.Context, serviceId uint, githubToken GithubToken) (*models.Token, error) {
        var dbToken models.Token

        req, err := http.NewRequest("GET", "https://api.github.com/user", nil)
        if err != nil {
                return nil, err
        }
        req.Header.Set("Authorization", "Bearer " + githubToken.Token)
        _, githubResponse, err := utils.SendRequest[GithubResponse](req)
        if err != nil {
                return nil, err
        }

        dbToken.Token = githubToken.Token
        dbToken.DisplayName = githubResponse.DisplayName
        dbToken.Email = githubResponse.Mail
        dbToken.ServiceID = serviceId
        return &dbToken, nil
}

func GithubCallback(c *gin.Context) (*models.Token, error) {
        serviceId, err := pkg.GetServiceFromName(c.Param("service"))
        if err != nil {
                c.AbortWithStatusJSON(http.StatusBadRequest, gin.H {
                        "message": "Service not found",
                })
                return nil, err
        }

        var githubCode GithubCode
        if err := c.ShouldBindJSON(&githubCode); err != nil {
                c.AbortWithStatusJSON(http.StatusBadRequest, gin.H {
                        "message": "Invalid request",
                })
                return nil, err
        }

        bearerToken, err := getGithubBearer(c, githubCode)
        if err != nil {
                c.AbortWithStatusJSON(http.StatusBadRequest, gin.H {
                        "message": "Invalid request",
                })
                return nil, err
        }
        return createGithubToken(c, serviceId, *bearerToken)
}
