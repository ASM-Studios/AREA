package models

import "gorm.io/gorm"

type WorkflowStatus string

type Event struct {
	gorm.Model
        ShortName       string          `json:"short_name"`
	Name            string          `json:"name"`
	Description     string          `json:"description"`
	ServiceID       uint            `gorm:"foreignKey:ServiceID" json:"service_id"`
	Parameters      []Parameters    `json:"parameters"`
	Type            EventType       `gorm:"type:enum('action', 'reaction');not null" json:"type"`
	WorkflowEvents  []WorkflowEvent `gorm:"constraint:OnDelete:CASCADE;" json:"workflow_events"`
}

const (
	WorkflowStatusPending   WorkflowStatus = "pending"
	WorkflowStatusProcessed WorkflowStatus = "processed"
	WorkflowStatusFailed    WorkflowStatus = "failed"
)
