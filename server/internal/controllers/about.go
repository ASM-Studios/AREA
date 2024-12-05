package controllers

import (
	"AREA/internal/models"
	"AREA/internal/pkg"
	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog/log"
	"net/http"
	"strconv"
	"time"
)

func getServices() (services []models.Service) {
	value := pkg.DB.Where("id > 0").Find(&services)
	if value.Error != nil {
		log.Printf("Error loading services from db: %v", value.Error)
		return
	}
	return services
}

// About handler with cached service data
func About(c *gin.Context) {
	var msg struct {
		Client struct {
			Host string `json:"host"`
		} `json:"client"`
		Server struct {
			CurrentTime string           `json:"current_time"`
			Services    []models.Service `json:"services"`
		} `json:"server"`
	}

	msg.Client.Host = c.ClientIP()
	msg.Server.CurrentTime = strconv.FormatInt(time.Now().Unix(), 10)
	msg.Server.Services = getServices()
	c.JSON(http.StatusOK, msg)
}
