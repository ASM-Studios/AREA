package discord

import (
	"AREA/internal/models"
	"AREA/internal/utils"
	"bytes"
	"encoding/json"
	"net/http"
)

type Message struct {
        Content string  `json:"content"`
}

func SendMessage(user *models.User, args map[string]string) {
        url := args["url"]
        message := Message {
                Content: args["content"],
        }
        body, err := json.Marshal(message)

        req, err := http.NewRequest("POST", url, bytes.NewBuffer(body))
        if err != nil {
                return
        }
        req.Header.Set("Content-Type", "application/json")
        resp, err := utils.SendRequest(req)
        if err != nil {
                return
        }
        defer resp.Body.Close()
}
