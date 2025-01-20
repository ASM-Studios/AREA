package middleware

import (
	"AREA/internal/models"
	"AREA/internal/pkg"
	db "AREA/internal/pkg"
	"AREA/internal/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func A2FMiddleware() gin.HandlerFunc {
        return func(c* gin.Context) {
                if isA2FAuthenticated(c) {
                        c.Next()
                        return
                }
        }
}

func isA2FAuthenticated(c *gin.Context) bool {
        user, err := pkg.GetUserFromToken(c)
        if err != nil {
                c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
                return false
        }
        if user.TwoFactorMethod == "none" {
                return true
        }
        status, err := utils.VerifyTokenA2F(c)
        if err != nil {
                return false
        }
        if status == "full" {
                return true
        } else {
                c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
                return false
        }
}

func AuthMiddleware() gin.HandlerFunc {
        return func(c *gin.Context) {
                if isAuthenticated(c) {
                        c.Next()
                        return
                }
        }
}

func isAuthenticated(c *gin.Context) bool {
        user := models.User{}
        email, err := utils.VerifyToken(c)
        if err != nil {
                if err.Error() == "Token is expired" {
                        c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Token is expired"})
                } else {
                        c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: " + err.Error()})
                }
                return false
        }
        db.DB.Where("email = ?", email).First(&user)
        if user.ID == 0 {
                c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
                return false
        }
        return true
}
