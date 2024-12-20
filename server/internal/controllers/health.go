package controllers

import (
	"AREA/internal/services"
	"AREA/internal/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

// SystemHealth godoc
// @Summary      Check system health
// @Description  Check the health of all system components (DB, RabbitMQ)
// @Tags         system
// @Accept       json
// @Produce      json
// @Success      200  {object}  services.HealthStatus
// @Failure      503  {object}  services.HealthStatus
// @Router       /health [get]
func SystemHealth(c *gin.Context) {
	healthService := services.GetHealthService()
	status := healthService.Check()

	if status.Status == "ok" {
		c.JSON(http.StatusOK, status)
		return
	}

	c.JSON(http.StatusServiceUnavailable, status)
}

// AuthHealth godoc
// @Summary      Check if the JWT is valid
// @Description  Validate the token and return 200 if valid, 401 if expired or invalid
// @Tags         auth
// @Accept       json
// @Produce      json
// @Success      200  {object}  map[string]string
// @Failure      401  {object}  map[string]string
// @Router       /auth/health [get]
func AuthHealth(c *gin.Context) {
	_, err := utils.VerifyToken(c)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: " + err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "healthy"})
}
