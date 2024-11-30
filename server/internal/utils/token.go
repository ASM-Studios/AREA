package utils

import (
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"net/http"
	"time"
)

func NewToken(c *gin.Context, email string) string {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email": email,
		"exp":   time.Now().Add(time.Hour * 1).Unix(),
	})
	tokenString, err := token.SignedString([]byte(GetEnvVar("SECRET_KEY")))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
	}
	return tokenString
}
