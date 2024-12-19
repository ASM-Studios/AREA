package oauth

import (
	"AREA/internal/models"
	"AREA/internal/pkg"
	"AREA/internal/utils"
	"errors"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ServiceInfo struct {
        Mail string
        DisplayName string
}

func createAccount(c *gin.Context, dbToken *models.Token) (*models.User) {
        var user models.User
        user.Email = dbToken.Email
        user.Username = dbToken.DisplayName
        user.Token = utils.NewToken(c, user.Email)

        pkg.DB.Create(&user)

        dbToken.UserID = user.ID
        pkg.DB.Create(&dbToken)
        return &user
}

func updateAccount(c *gin.Context, dbToken *models.Token) (*models.User) {
        var user models.User
        pkg.DB.Where("id = ?", dbToken.UserID).First(&user)
        pkg.DB.Where("email = ?", dbToken.Email).First(dbToken).Update("value", dbToken.Token)
        user.Token = utils.NewToken(c, user.Email)
        pkg.DB.UpdateColumns(&user)
        return &user
}

func OAuthRegisterAccount(c *gin.Context, dbToken *models.Token) (*models.User, error) {
        serviceId, err := pkg.GetServiceFromName(c.Param("service"))

        err = pkg.DB.Where("email = ? AND service_id = ?", dbToken.Email, serviceId).First(dbToken).Error

        if errors.Is(err, gorm.ErrRecordNotFound) {
                return createAccount(c, dbToken), nil
        } else {
                return updateAccount(c, dbToken), nil
        }
}

func OAuthBindAccount(c *gin.Context, dbToken *models.Token) (*models.User, error) {
        serviceId, _ := pkg.GetServiceFromName(c.Param("service"))
        user, err := pkg.GetUserFromToken(c)
        pkg.DB.Where("email = ?", user.Email).First(&user)

        if err != nil {
                return nil, err
        }
        dbToken.UserID = user.ID

        err = pkg.DB.Where("email = ? AND service_id = ?", dbToken.Email, serviceId).First(dbToken).Error

        if errors.Is(err, gorm.ErrRecordNotFound) {
                pkg.DB.Create(&dbToken)
        } else {
                pkg.DB.Model(&dbToken).Update("value", dbToken.Token)
        }
        return &user, nil
}
