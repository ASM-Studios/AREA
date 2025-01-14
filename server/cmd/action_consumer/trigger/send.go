package trigger

import (
	"AREA/internal/gconsts"
	"AREA/internal/models"
	"encoding/json"

	"github.com/rabbitmq/amqp091-go"
)

func sendWorkflow(workflow *models.Workflow, reaction_args map[string]interface{}) {
        payload := struct {
                Workflow        *models.Workflow        `json:"workflow"`
                Args            map[string]interface{}  `json:"args"`
        } {Workflow: workflow, Args: reaction_args}
        body, err := json.Marshal(payload)
        if err != nil {
                return
        }
        gconsts.Connection.Channel.Publish("", "reaction", false, false, amqp091.Publishing{
                ContentType: "application/json",
                Body:        body,
        })
}
