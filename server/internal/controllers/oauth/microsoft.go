package oauth

import (
	"AREA/internal/models"
	"AREA/internal/pkg"
	"AREA/internal/utils"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type MicrosoftResponse struct {
        Mail string `json:"mail"`
        DisplayName string `json:"displayName"`
}

func createAccount(c *gin.Context, response MicrosoftResponse, token *models.Token) (*models.User) {
    var user models.User
    user.Email = token.Email
    user.Username = response.DisplayName
	
    user.Token = utils.NewToken(c, user.Email)

    pkg.DB.Create(&user)
    token.UserID = user.ID
    pkg.DB.Create(&token)
    return &user
}

func getBindedAccount(c *gin.Context, response MicrosoftResponse, token *models.Token) (*models.User, error) {
    serviceId, _ := pkg.GetServiceFromName(c.Param("service"))
    err := pkg.DB.Where("email = ? AND service_id = ?", token.Email, serviceId).First(token).Error

    if errors.Is(err, gorm.ErrRecordNotFound) {
        return createAccount(c, response, token), nil
    } else {
        var user models.User
        pkg.DB.Where("id = ?", token.UserID).First(&user)
        pkg.DB.Where("email = ?", token.Email).First(token).Update("value", token.Value)
        user.Token = utils.NewToken(c, user.Email)
        pkg.DB.UpdateColumns(&user)
        return &user, nil
    }
}

func MicrosoftCallback(c *gin.Context, token *models.Token) (*models.User, error) {
        httpRequestUrl := "https://graph.microsoft.com/v1.0/me"
        req, err := http.NewRequest("GET", httpRequestUrl, nil)
        if err != nil {
                fmt.Println(err)
                err := errors.New("Error creating request")
                return nil, err

        }
        req.Header.Set("Authorization", "Bearer " + token.Value)
        client := &http.Client{}
        resp, err := client.Do(req)
        if err != nil {
                fmt.Println(err)
                return nil, errors.New("Error executing request")
        }
        defer resp.Body.Close()
        b, err := io.ReadAll(resp.Body)
        if err != nil {
                fmt.Println(err)
                return nil, errors.New("Error reading request")
        }
        var response MicrosoftResponse
        json.Unmarshal([]byte(b), &response)
        token.Email = response.Mail
        return getBindedAccount(c, response, token)
}
