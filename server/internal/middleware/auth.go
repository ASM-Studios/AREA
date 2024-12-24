package middleware

import (
        "AREA/internal/models"
        db "AREA/internal/pkg"
        "AREA/internal/utils"
        "github.com/gin-gonic/gin"
        "net/http"
)

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
