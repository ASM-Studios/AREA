package utils

import (
	"errors"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"net/http"
	"strings"
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

func VerifyToken(c *gin.Context) (string, error) {
	authHeader := c.GetHeader("Authorization")

	if !strings.HasPrefix(authHeader, "Bearer ") {
		return "", errors.New("Bearer token is missing")
	}

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")

	if tokenString == "" {
		return "", errors.New("Authorization token is missing")
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("Invalid signing method")
		}
		return []byte(GetEnvVar("SECRET_KEY")), nil
	})

	if err != nil {
		if err.Error() == "Token is expired" {
			return "", errors.New("Token is expired")
		}
		return "", err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if ok && token.Valid {
		email := claims["email"].(string)
		return email, nil
	}

	return "", errors.New("Invalid token")
}
