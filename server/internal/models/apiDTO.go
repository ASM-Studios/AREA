package models

type WorkflowDTO struct {
	UserID      uint           `json:"user_id"`
	Name        string         `json:"name"`
	Description string         `json:"description"`
	Status      WorkflowStatus `json:"status"`
	IsActive    bool           `json:"is_active"`
	Events      []EventDTO     `json:"events"`
}

type EventDTO struct {
	Name        string          `json:"name"`
	Description string          `json:"description"`
	ServiceID   uint            `gorm:"foreignKey:ServiceID" json:"service_id"`
	Parameters  []ParametersDTO `json:"parameters"`
	Type        EventType       `gorm:"type:enum('action', 'reaction');not null" json:"type"`
}

type ParametersDTO struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Type        string `json:"type"`
	EventID     uint   `gorm:"foreignKey:EventID" json:"event_id"`
}
