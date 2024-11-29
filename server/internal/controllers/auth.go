package controllers

import (
	"AREA/internal/models"
	"AREA/internal/pkg"
	"AREA/internal/utils"
	"github.com/gin-gonic/gin"
	"net/http"
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
	var user models.User
	db.DB.Where("email = ? AND password = ?", email, password).First(&user)
	if user.ID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}
	tokenString := utils.NewToken(c, email)
	db.DB.Model(&user).Update("token", tokenString)
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
	tokenString := utils.NewToken(c, c.PostForm("email"))
	var user models.User
	db.DB.Where("email = ?", c.PostForm("email")).First(&user)
	if user.ID != 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "User already exists"})
		return
	}
	db.DB.Create(&models.User{
		Email:    c.PostForm("email"),
		Password: c.PostForm("password"),
		Token:    tokenString,
	})
	c.JSON(http.StatusOK, gin.H{"token": tokenString})
}
