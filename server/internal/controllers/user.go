package controllers

import (
	"AREA/internal/models"
	"AREA/internal/pkg"
	"github.com/gin-gonic/gin"
)

func UserMe(c *gin.Context) {
	user, err := pkg.GetUserFromToken(c)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to fetch user"})
		return
	}
	pkg.DB.Preload("Tokens").First(&user)
	
	var services []models.ServiceRequest
	for _, token := range user.Tokens {
		var service models.Service
		pkg.DB.Where("id = ?", token.ServiceID).First(&service)
		services = append(services, models.ServiceRequest{
			Name: service.Name,
			ID:   service.ID,
		})
	}

	var userData = models.UserRequest{
		Username: user.Username,
		Email:    user.Email,
		Services: services,
	}
	c.JSON(200, gin.H{"user": userData})
}
func UserDelete(c *gin.Context) {
	user, err := pkg.GetUserFromToken(c)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to fetch user"})
		return
	}
	if err := pkg.DB.Unscoped().Delete(&user).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to delete user", "details": err.Error()})
		return
	}
	c.JSON(200, gin.H{"success": "User deleted"})
}
