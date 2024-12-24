package pkg

import (
	"AREA/internal/models"
	"AREA/internal/utils"
	"errors"

	"github.com/gin-gonic/gin"
)

func GetUserFromToken(c *gin.Context) (models.User, error) {
	email, err := utils.VerifyToken(c)
	if err != nil {
		return models.User{}, err
	}
	user := models.User{}
	DB.Where("email = ?", email).First(&user)
	if user.ID == 0 {
		return models.User{}, errors.New("User not found")
	}
	return user, nil
}

func GetServiceFromName(serviceName string) (int) {
	var service models.Service
	if err := DB.Where("name = ?", serviceName).First(&service).Error; err != nil {
		return -1
    }
	return int(service.ID)
}
