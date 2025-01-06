package controllers

import (
	"AREA/internal/gconsts"
	"AREA/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/rabbitmq/amqp091-go"
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
        exchange := c.PostForm("exchange")
        key := c.PostForm("key")
        message := c.PostForm("message")
        msg.Message = message

        gconsts.Connection.Channel.Publish(exchange, key, false, false, amqp091.Publishing{
                ContentType: "text/plain",
                Body:        []byte(msg.Message),
        })

        c.JSON(http.StatusOK, gin.H{
                "response": "Message received",
        })

}
