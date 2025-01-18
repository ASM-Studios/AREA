package controllers

import (
	"AREA/internal/models"
	"AREA/internal/pkg"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SecretCreate(c *gin.Context) {
        var secretRequest models.SecretRequest
        if err := c.ShouldBindJSON(&secretRequest); err != nil {
                c.JSON(http.StatusBadRequest, gin.H{"error": "bad request"})
                return
        }

        user, err := pkg.GetUserFromToken(c)
        if err != nil {
                c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch user"})
        }

        secret := models.Secret {
                UserID: user.ID,
                Key: secretRequest.Key,
                Value: secretRequest.Value,
        }
        pkg.DB.Save(&secret)
        c.JSON(http.StatusNoContent, gin.H{})
}

func SecretList(c *gin.Context) {
        user, err := pkg.GetUserFromToken(c)
        if err != nil {
                c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch user"})
        }

        var secrets []models.Secret
        pkg.DB.Table("secrets").Where("user_id = ?", user.ID).Find(&secrets)
        c.JSON(http.StatusOK, gin.H{"secrets": secrets})
}

func SecretDelete(c *gin.Context) {
        secretId := c.Param("id")
        var secret models.Secret
        err := pkg.DB.Table("secrets").Where("id = ?", secretId).First(&secret).Error
        if errors.Is(err, gorm.ErrRecordNotFound) {
                c.JSON(http.StatusNotFound, gin.H{"error": "secret not found"})
                return
        }

        user, err := pkg.GetUserFromToken(c)
        if err != nil {
                c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch user"})
        }

        if secret.UserID != user.ID {
                c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
                return
        }
        pkg.DB.Unscoped().Delete(&secret, secretId)
        c.JSON(http.StatusNoContent, gin.H{})
}
