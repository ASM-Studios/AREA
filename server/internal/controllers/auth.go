package controllers

import (
	"AREA/internal/a2f"
	"AREA/internal/gconsts"
	"AREA/internal/mail"
	"AREA/internal/models"
	"AREA/internal/pkg"
	db "AREA/internal/pkg"
	"AREA/internal/utils"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/pquerna/otp/totp"
)

var a2fMethods = map[string]func(*models.User, *models.A2FRequest) bool {
        "none": func(user *models.User, a2fRequest *models.A2FRequest) bool {
                return true
        },
        "totp": func(user *models.User, a2fRequest *models.A2FRequest) bool {
                result := totp.Validate(a2fRequest.Code, user.TOTP)
                if result {
                        return true
                } else {
                        return false
                }
        },
        "mail": func(user *models.User, a2fRequest *models.A2FRequest) bool {
                res := a2f.ValidateMailCode(user, a2fRequest)
                if res {
                         return true
                } else {
                        return false
                }
        },
}

// LoginA2F godoc
// @Summary      Login a user with 2FA
// @Description  Authenticate a user with 2FA and return a JWT token
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        Login body models.A2FRequest true  "Login"
// @Success      200  {object}  map[string]string
// @Failure      400  {object}  map[string]string
func LoginA2F(c *gin.Context) {
        var a2fRequest models.A2FRequest
        err := c.ShouldBindJSON(&a2fRequest)
        if err != nil {
                c.AbortWithStatusJSON(400, gin.H {
                        "error": "Invalid request",
                })
                return
        }

        user, err := pkg.GetUserFromToken(c)
        if err != nil {
                c.AbortWithStatusJSON(500, gin.H {
                        "error": "Failed to fetch user",
                })
                return
        }
        callback, ok := a2fMethods[user.TwoFactorMethod]
        if !ok {
                c.JSON(http.StatusBadRequest, gin.H {
                        "error": "Invalid method",
                })
                return
        }
        result := callback(&user, &a2fRequest)
        if result {
                tokenString := utils.NewToken(c, user.Email, "full")
	        db.DB.Model(&user).Update("token", tokenString)
                c.JSON(http.StatusOK, gin.H{"jwt": tokenString})
        } else  {
                c.JSON(400, gin.H {
                        "error": "Invalid code",
                })
        }
}

// Login godoc
// @Summary      Login a user
// @Description  Authenticate a user and return a JWT token
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        Login body models.LoginRequest true  "Login"
// @Success      200  {object}  map[string]string
// @Failure      401  {object}  map[string]string
// @Router       /auth/login [post]
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

        var tokenString string
        if user.TwoFactorMethod == "none" {
                tokenString = utils.NewToken(c, LoginData.Email, "full")
                c.JSON(http.StatusOK, gin.H{"jwt": tokenString})
        } else {
                tokenString = utils.NewToken(c, LoginData.Email, "mid")
                if user.TwoFactorMethod == "mail" {
                        a2f.Generate2FAMailCode(&user)
                }
                c.JSON(http.StatusTeapot, gin.H{
                        "jwt": tokenString,
                        "method": user.TwoFactorMethod,
                })
        }

	db.DB.Model(&user).Update("token", tokenString)
}

// Register godoc
// @Summary      Register a user
// @Description  Create a new user and return a JWT token
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        Register body models.RegisterRequest true  "Register"
// @Success      200  {object}  map[string]string
// @Failure      409  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /auth/register [post]
func Register(c *gin.Context) {
	var RegisterData models.RegisterRequest
	err := c.ShouldBindJSON(&RegisterData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	tokenString := utils.NewToken(c, RegisterData.Email, "full")
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
        newUser := models.User{
		Email:                  RegisterData.Email,
                ValidEmail:             false,
		Username:               RegisterData.Username,
		Password:               password,
		Salt:                   salt,
		Token:                  tokenString,
                TwoFactorMethod:        "none",
                ValidTOTP:              false,
	}
	db.DB.Create(&newUser)

        mail.SendHTMLMail(RegisterData.Email, "Welcome to AREA", gconsts.RegisterMail)

	c.JSON(http.StatusOK, gin.H{"username": RegisterData.Username, "email": RegisterData.Email, "jwt": tokenString})
}
