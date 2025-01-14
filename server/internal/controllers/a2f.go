package controllers

import (
	"AREA/internal/a2f"
	"AREA/internal/models"
	"AREA/internal/pkg"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/pquerna/otp/totp"
)

func SelectMethod(c *gin.Context) {
        user, err := pkg.GetUserFromToken(c)
        if err != nil {
                c.JSON(500, gin.H {
                        "error": "Failed to fetch user",
                })
        }

        var method models.A2FMethod
        err = c.ShouldBindJSON(&method)
        if err != nil {
                c.JSON(http.StatusBadRequest, gin.H {
                        "error": "Invalid request",
                })
        }
        user.F2aMethod = method.Method
        pkg.DB.Save(&user)
}

func GenerateTOTP(c *gin.Context) {
        user, err := pkg.GetUserFromToken(c)
        if err != nil {
                c.JSON(500, gin.H {
                        "error": "Failed to fetch user",
                })
        }

        key, err := totp.Generate(totp.GenerateOpts {
                Issuer: "AREA",
                AccountName: user.Email,
        })
        user.TOTP = key.Secret()
        pkg.DB.Save(&user)
        c.JSON(200, gin.H {
                "url": fmt.Sprintf("otpauth://totp/AREA:%s?secret=%s&issuer=AREA", user.Email, key.Secret()),
        })
}

func ValidateTOTP(c *gin.Context) {
        user, err := pkg.GetUserFromToken(c)
        if err != nil {
                c.JSON(500, gin.H {
                        "error": "Failed to fetch user",
                })
        }

        if user.TOTP == "" {
                c.JSON(400, gin.H {
                        "error": "TOTP not enabled",
                })
                return
        }

        var code models.A2FRequest
        err = c.ShouldBindJSON(&code)
        if err != nil {
                return
        }
        if totp.Validate(code.Code, user.TOTP) {
                user.ValidTOTP = true
                pkg.DB.Save(&user)
                c.JSON(200, gin.H {
                        "message": "TOTP valid",
                })
        } else {
                c.JSON(401, gin.H {
                        "error": "Invalid TOTP",
                })
        }
}

func GenerateMailCode(c *gin.Context) {
        user, err := pkg.GetUserFromToken(c)
        if err != nil {
                c.JSON(500, gin.H {
                        "error": "Failed to fetch user",
                })
        }

        a2f.GenerateMailCode(&user)
        c.JSON(204, gin.H{})
}

func ValidateMailCode(c *gin.Context) {
        user, err := pkg.GetUserFromToken(c)
        if err != nil {
                c.JSON(500, gin.H {
                        "error": "Failed to fetch user",
                })
        }
        if user.ValidEmail {
                c.JSON(400, gin.H {
                        "error": "Email already validated",
                })
                return
        }

        var code models.A2FRequest
        err = c.ShouldBindJSON(&code)
        if err != nil {
                c.AbortWithStatusJSON(http.StatusBadRequest, gin.H {
                        "error": "Invalid request",
                })
                return
        }

        res := a2f.ValidateMailCode(&user, &code)
        if res {
                user.ValidEmail = true
                pkg.DB.Save(&user)
                c.JSON(204, gin.H{})
        } else {
                c.JSON(400, gin.H {
                        "error": "Invalid code",
                })
        }
}
