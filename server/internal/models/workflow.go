package models

import "gorm.io/gorm"

type EventType string

const (
	ActionEventType   EventType = "action"
	ReactionEventType EventType = "reaction"
)

type Parameters struct {
	gorm.Model
	Name        string `json:"name"`
	Description string `json:"description"`
	Type        string `json:"type"`
	EventID     uint   `gorm:"foreignKey:EventID" json:"event_id"`
}

type Workflow struct {
	gorm.Model
	UserID      uint           `gorm:"foreignKey:UserID" json:"user_id"`
	Name        string         `json:"name"`
	Description string         `json:"description"`
	Status      WorkflowStatus `gorm:"type:enum('pending', 'processed', 'failed')" json:"status"`
	Events      []Event        `gorm:"many2many:workflow_events" json:"events"`
}
