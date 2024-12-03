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
// @Router       /login [post]
func Login(c *gin.Context) {
	email := c.PostForm("email")
	password := c.PostForm("password")
	var user models.User
	pkg.DB.Where("email = ?", email).First(&user)
	if user.ID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}
	if err := utils.VerifyPassword(password, user.Password, user.Salt); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	tokenString := utils.NewToken(c, email)
	pkg.DB.Model(&user).Update("jwt", tokenString)
	c.JSON(http.StatusOK, gin.H{"jwt": tokenString})
}

// Register godoc
// @Summary      Register a user
// @Description  Create a new user and return a JWT token
// @Tags         auth
// @Accept       x-www-form-urlencoded
// @Produce      json
// @Param        email  formData  string  true  "Email"
// @Param        username  formData  string  true  "Username"
// @Param        password  formData  string  true  "Password"
// @Success      200  {object}  map[string]string
// @Failure      409  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /register [post]
func Register(c *gin.Context) {
	email := c.PostForm("email")
	tokenString := utils.NewToken(c, email)
	username := c.PostForm("username")
	var user models.User
	pkg.DB.Where("email = ?", email).First(&user)
	if user.ID != 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "User already exists"})
		return
	}
	password, salt := utils.HashPassword(c.PostForm("password"))

	pkg.DB.Create(&models.User{
		Email:    email,
		Password: password,
		Salt:     salt,
		Token:    tokenString,
	})
	c.JSON(http.StatusOK, gin.H{"username": username, "email": email, "jwt": tokenString})
}
