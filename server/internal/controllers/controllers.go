package controllers

import (
	"AREA/internal/utils"
	"github.com/gin-gonic/gin"
	"net/http"
)

// Ping godoc
// @Summary Ping
// @Description ping
// @Tags ping
// @Accept  json
// @Produce  json
// @Success 200 {object} string
// @Router /ping [get]
func Ping(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "pong",
	})
}

func TryQueue(c *gin.Context) {
	utils.TryQueue()
	c.JSON(http.StatusOK, gin.H{
		"message": "message published",
	})
}
