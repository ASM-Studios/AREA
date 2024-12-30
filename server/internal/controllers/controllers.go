package controllers

import (
	"AREA/internal/utils"
	"net/http"

	"github.com/gin-gonic/gin"
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

func Trigger(c *gin.Context) {
        var producer utils.RMQProducer
        producer.Queue = "trigger"
        producer.ConnectionString = utils.GetEnvVar("RMQ_URL")
        producer.PublishMessage("text", []byte("trigger"))
}
