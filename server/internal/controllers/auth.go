package controllers

import (
	"AREA/internal/config"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"net/http"
	"time"
)

// Login godoc
// @Summary      Login a user
// @Description  Authenticate a user and return a JWT token
// @Tags         auth
// @Accept       x-www-form-urlencoded
// @Produce      json
// @Param        email  formData  string  true  "Email"
// @Param        password  formData  string  true  "Password"
// @Success      200  {object}  map[string]string
// @Failure      401  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /login [post]
func Login(c *gin.Context) {
	email := c.PostForm("email")
	password := c.PostForm("password")
	if password != "password" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email": email,
		"exp":   time.Now().Add(time.Hour * 1).Unix(),
	})
	tokenString, err := token.SignedString([]byte(config.AppConfig.SecretKey))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"token": tokenString})
}

// Register godoc
// @Summary      Register a user
// @Description  Create a new user account
// @Tags         auth
// @Accept       x-www-form-urlencoded
// @Produce      json
// @Param        email     formData  string  true  "Email"
// @Param        password  formData  string  true  "Password"
// @Success      201  {object}  map[string]string
// @Router       /register [post]
func Register(c *gin.Context) {
	c.PostForm("email")
	c.PostForm("password")
	c.JSON(http.StatusCreated, gin.H{"message": "User created"})
}
