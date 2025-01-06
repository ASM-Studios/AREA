package controllers

import (
	"AREA/internal/models"
	"AREA/internal/utils"
	"github.com/gin-gonic/gin"
	"net/http"
)

// Message godoc
// @Summary Message
// @Description publish/Message
// @Tags publish/Message
// @Accept  json
// @Produce  json
// @Param        message  formData  string  true  "Message"
// @Success 200 {object} string
// @Router /publish/message [post]
func Message(c *gin.Context) {
	var msg models.Message
        messageQueue := c.PostForm("message_queue")
	message := c.PostForm("message")
	msg.Message = message

	connectionString := utils.GetEnvVar("RMQ_URL")
	rmqProducer := utils.RMQProducer{
		Queue: messageQueue,
		ConnectionString:   connectionString,
	}

	rmqProducer.PublishMessage("text/plain", []byte(msg.Message))

	c.JSON(http.StatusOK, gin.H{
		"response": "Message received",
	})

}
