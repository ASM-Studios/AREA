package pkg

import (
	"AREA/internal/models"
	"AREA/internal/utils"
	"errors"
	"github.com/gin-gonic/gin"
)

func GetUserFromToken(c *gin.Context) (uint, error) {
	email, err := utils.VerifyToken(c)
	if err != nil {
		return 0, err
	}
	user := models.User{}
	DB.Where("email = ?", email).First(&user)
	if user.ID == 0 {
		return 0, errors.New("User not found")
	}
	return user.ID, nil
}
