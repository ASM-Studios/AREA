package controllers

import (
	"AREA/internal/models"
	"AREA/internal/pkg"
	"AREA/internal/utils"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
)

// Login godoc
// @Summary      Login a user
// @Description  Authenticate a user and return a JWT token
// @Tags         auth
// @Accept       x-www-form-urlencoded
// @Produce      json
// @Param        email  json  string  true  "email"
// @Param        password  json  string  true  "password"
// @Success      200  {object}  map[string]string
// @Failure      401  {object}  map[string]string
// @Router       /login [post]
func Login(c *gin.Context) {
	var LoginData models.LoginRequest
	err := c.ShouldBindJSON(&LoginData)
	log.Println(LoginData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var user models.User
	db.DB.Where("email = ?", LoginData.Email).First(&user)
	if user.ID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}
	if err := utils.VerifyPassword(LoginData.Password, user.Password, user.Salt); err != nil {
		println(err)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}
	tokenString := utils.NewToken(c, LoginData.Email)
	db.DB.Model(&user).Update("token", tokenString)
	c.JSON(http.StatusOK, gin.H{"jwt": tokenString})
}

// Register godoc
// @Summary      Register a user
// @Description  Create a new user and return a JWT token
// @Tags         auth
// @Accept       x-www-form-urlencoded
// @Produce      json
// @Param        email  json  string  true  "email"
// @Param        username  json  string  true  "username"
// @Param        password  json  string  true  "password"
// @Success      200  {object}  map[string]string
// @Failure      409  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /register [post]
func Register(c *gin.Context) {
	var RegisterData models.RegisterRequest
	err := c.ShouldBindJSON(&RegisterData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	tokenString := utils.NewToken(c, RegisterData.Email)
	var user models.User
	db.DB.Where("email = ?", RegisterData.Email).First(&user)
	if user.ID != 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "User already exists"})
		return
	}
	db.DB.Where("username = ?", RegisterData.Username).First(&user)
	if user.ID != 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "Username already exists"})
		return
	}
	password, salt := utils.HashPassword(RegisterData.Password)
	db.DB.Create(&models.User{
		Email:    RegisterData.Email,
		Username: RegisterData.Username,
		Password: password,
		Salt:     salt,
		Token:    tokenString,
	})
	c.JSON(http.StatusOK, gin.H{"username": RegisterData.Username, "email": RegisterData.Email, "jwt": tokenString})
}

// Health godoc
// @Summary      Check if the JWT is valid
// @Description  Validate the token and return 200 if valid, 401 if expired or invalid
// @Tags         auth
// @Accept       json
// @Produce      json
// @Success      200  {object}  map[string]string
// @Failure      401  {object}  map[string]string
// @Router       /auth/health [get]
func Health(c *gin.Context) {
	token := c.GetHeader("Authorization")
	if token == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: No token provided"})
		return
	}
	_, err := utils.VerifyToken(c)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: " + err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "healthy"})
}
