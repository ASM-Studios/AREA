package middleware

import (
	"AREA/internal/models"
	db "AREA/internal/pkg"
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
	return true
}
