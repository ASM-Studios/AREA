package controllers

import (
	"AREA/internal/models"
	"AREA/internal/pkg"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
	"time"
)

// About handler with cached service data
func About(c *gin.Context) {
	var msg struct {
		Client struct {
			Host string `json:"host"`
		} `json:"client"`
		Server struct {
			CurrentTime string               `json:"current_time"`
			Services    []models.ServiceList `json:"services"`
		} `json:"server"`
	}

	msg.Client.Host = c.ClientIP()
	msg.Server.CurrentTime = strconv.FormatInt(time.Now().Unix(), 10)
	msg.Server.Services = pkg.CachedServices
	c.JSON(http.StatusOK, msg)
}
