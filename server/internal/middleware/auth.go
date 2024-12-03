package middleware

import (
	"AREA/internal/models"
	db "AREA/internal/pkg"
	"AREA/internal/utils"
	"github.com/gin-gonic/gin"
	"net/http"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		if isAuthenticated(c) {
			c.Next()
			return
		}
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
	}
}

func isAuthenticated(c *gin.Context) bool {
	token := c.GetHeader("Authorization")
	if token == "" {
		return false
	}

	user := models.User{}
	db.DB.Where("token = ?", token).First(&user)
	if user.ID == 0 {
		return false
	}
	_, err := utils.VerifyToken(c)
	if err != nil {
		if err.Error() == "Token is expired" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token is expired"})
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: " + err.Error()})
		}
		return false
	}
	return true
}
