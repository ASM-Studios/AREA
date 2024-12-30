package models

type Message struct {
        Queue   string `json:"queue" binding:"required"`
	Message string `json:"message" binding:"required"`
}
