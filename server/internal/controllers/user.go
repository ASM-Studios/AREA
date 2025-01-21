package controllers

import (
	"AREA/internal/models"
	"AREA/internal/pkg"
	"github.com/gin-gonic/gin"
)

// UserMe retrieves the authenticated user's details.
// @Summary Get authenticated user details
// @Description Retrieve the details of the currently authenticated user, including their associated services.
// @Tags User
// @Security BearerAuth
// @Produce json
// @Success 200 {object} map[string]interface{} "Authenticated user's details"
// @Failure 500 {object} map[string]interface{} "Failed to fetch user details"
// @Router /users/me [get]
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
                        ConnectedAt: token.UpdatedAt.String(),
		})
	}

	var userData = models.UserRequest{
		Username: user.Username,
		Email: user.Email,
                ValidEmail: user.ValidEmail,
                TwoFactorMethod: user.TwoFactorMethod,
		Services: services,
	}
	c.JSON(200, gin.H{"user": userData})
}

// UserDelete deletes the authenticated user's account.
// @Summary Delete user account
// @Description Permanently delete the account of the currently authenticated user.
// @Tags User
// @Security BearerAuth
// @Produce json
// @Success 200 {object} map[string]interface{} "User account deleted successfully"
// @Failure 500 {object} map[string]interface{} "Failed to delete user account"
// @Router /users [delete]
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
