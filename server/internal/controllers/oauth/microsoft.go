package oauth

import (
	"AREA/internal/models"
	"AREA/internal/pkg"
	"encoding/json"
	"errors"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
)

type MicrosoftToken struct {
        Token string `json:"token"`
}

type MicrosoftResponse struct {
        Mail string `json:"mail"`
        DisplayName string `json:"displayName"`
}

func createMicrosoftToken(serviceId uint, microsoftToken MicrosoftToken, microsoftResponse MicrosoftResponse) *models.Token {
        var dbToken models.Token

        dbToken.Token = microsoftToken.Token
        dbToken.DisplayName = microsoftResponse.DisplayName
        dbToken.Email = microsoftResponse.Mail
        dbToken.ServiceID = serviceId
        return &dbToken
}

func MicrosoftCallback(c *gin.Context) (*models.Token, error) {
        serviceId, err := pkg.GetServiceFromName(c.Param("service"))
        if err != nil {
                c.AbortWithStatusJSON(http.StatusBadRequest, gin.H {
                        "message": "Service not found",
                })
                return nil, err
        }

        var microsoftToken MicrosoftToken
        if err := c.ShouldBindJSON(&microsoftToken); err != nil {
                c.AbortWithStatusJSON(http.StatusBadRequest, gin.H {
                        "message": "Invalid request",
                })
                return nil, err
        }

        httpRequestUrl := "https://graph.microsoft.com/v1.0/me"
        req, err := http.NewRequest("GET", httpRequestUrl, nil)
        if err != nil {
                err := errors.New("Error creating request")
                return nil, err

        }
        req.Header.Set("Authorization", "Bearer " + microsoftToken.Token)
        client := &http.Client{}
        resp, err := client.Do(req)
        if err != nil {
                return nil, errors.New("Error executing request")
        }
        defer resp.Body.Close()
        b, err := io.ReadAll(resp.Body)
        if err != nil {
                return nil, errors.New("Error reading request")
        }
        var microsoftResponse MicrosoftResponse
        json.Unmarshal([]byte(b), &microsoftResponse)
        return createMicrosoftToken(serviceId, microsoftToken, microsoftResponse), nil
}
