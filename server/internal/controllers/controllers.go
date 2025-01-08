package controllers

import (
	"AREA/internal/gconsts"
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/rabbitmq/amqp091-go"
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

type TriggerRequest struct {
        User            string  `json:"user"`
        Workflow        string  `json:"workflow"`
}

func Trigger(c *gin.Context) {
        triggerRequest := TriggerRequest{
                User: "*",
                Workflow: "*",
        }
        bytes, _ := json.Marshal(triggerRequest)
        gconsts.Connection.Channel.Publish("action", "trigger", false, false, amqp091.Publishing{
                ContentType: "application/json",
                Body:        bytes,
        })
}
