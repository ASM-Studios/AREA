package models

import "gorm.io/gorm"

type EventType string

const (
	ActionEventType   EventType = "action"
	ReactionEventType EventType = "reaction"
)

type Parameters struct {
	gorm.Model
	Name             string            `json:"name"`
	Description      string            `json:"description"`
	Type             string            `json:"type"`
	EventID          uint              `gorm:"foreignKey:EventID" json:"event_id"`
	ParametersValues []ParametersValue `gorm:"constraint:OnDelete:CASCADE;" json:"parameters_values"`
}

type ParametersValue struct {
	gorm.Model
	ParametersID    uint   `gorm:"foreignKey:ParametersID" json:"parameters_id"`
	WorkflowEventID uint   `gorm:"foreignKey:WorkflowEventID" json:"workflow_event_id"`
	Value           string `gorm:"not null" json:"value"`
}

type Workflow struct {
	gorm.Model
	UserID         uint            `gorm:"foreignKey:UserID" json:"user_id"`
	Name           string          `json:"name"`
	Description    string          `json:"description"`
	Status         WorkflowStatus  `gorm:"type:enum('pending', 'processed', 'failed')" json:"status"`
	IsActive       bool            `json:"is_active"`
	WorkflowEvents []WorkflowEvent `gorm:"constraint:OnDelete:CASCADE;" json:"events"`
}

type WorkflowEvent struct {
	gorm.Model
	WorkflowID       uint              `gorm:"foreignKey:WorkflowID" json:"workflow_id"`
	EventID          uint              `gorm:"foreignKey:EventID" json:"event_id"`
	ParametersValues []ParametersValue `gorm:"constraint:OnDelete:CASCADE;" json:"parameters_values"`
}

func (w *Workflow) BeforeCreate(tx *gorm.DB) (err error) {
	if w.Status == "" {
		w.Status = WorkflowStatusPending
	}
	w.IsActive = true
	return
}
