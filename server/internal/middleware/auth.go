package middleware

import (
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
	// Do some JWT token authentication;
	return true
}
