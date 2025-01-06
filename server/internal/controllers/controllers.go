package controllers

import (
	"AREA/internal/gconsts"
	"AREA/internal/models"
	"AREA/internal/pkg"
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

func sendWorkflow() {
        rows, err := pkg.DB.Table("workflows").Rows()
        if err != nil {
                return
        }
        defer rows.Close()
        for rows.Next() {
                var workflow models.Workflow
                pkg.DB.ScanRows(rows, &workflow)
                body, _ := json.Marshal(workflow)
                gconsts.Connection.Channel.Publish("", "action", false, false, amqp091.Publishing{
                        ContentType: "application/json",
                        Body:        body,
                })
        }
}

func Trigger(c *gin.Context) {
        sendWorkflow()
}
