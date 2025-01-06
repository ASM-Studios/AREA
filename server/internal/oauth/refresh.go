package oauth

import (
	"AREA/internal/models"
	"AREA/internal/pkg"
	"AREA/internal/utils"
	"bytes"
	"errors"
	"net/http"
	"net/url"

	"gorm.io/gorm"
)

func FetchNewToken(dbToken *models.Token) (error) {
        var service models.Service
        err := pkg.DB.Where("id = ?", dbToken.ServiceID).First(&service).Error
        if errors.Is(err, gorm.ErrRecordNotFound) {
                return errors.New("Service not found")
        }

        oauthApp := OAuthApps[service.Name]

        form := url.Values{}
        form.Add("grant_type", "refresh_token")
        form.Add("refresh_token", dbToken.RefreshToken)
        form.Add("client_id", utils.GetEnvVar(oauthApp.ClientId))
        form.Add("client_secret", utils.GetEnvVar(oauthApp.ClientSecret))

        req, err := http.NewRequest("POST", oauthApp.TokenURL, bytes.NewBufferString(form.Encode()))
        if err != nil {
                return errors.New("Failed to create request")
        }
        req.Header.Set("Accept", "application/json")
        req.Header.Set("Origin", "http://localhost")
        req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

        resp, err := utils.SendRequest(req)
        if err != nil || resp.StatusCode != 200 {
                return errors.New("Invalid request")
        }
        serviceBearerToken, err := utils.ExtractBody[ServiceBearerToken](resp)
        dbToken.Token = serviceBearerToken.Token
        if len(serviceBearerToken.RefreshToken) > 0 {
                dbToken.RefreshToken = serviceBearerToken.RefreshToken
        }
        pkg.DB.Save(&dbToken)
        return nil
}
