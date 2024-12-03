package models

import "gorm.io/gorm"

type Service struct {
	gorm.Model
	Name      string     `gorm:"unique;not null" json:"name"`
	Actions   []Action   `json:"actions"`
	Reactions []Reaction `json:"reactions"`
}

type Action struct {
	gorm.Model
	ServiceID   uint          `json:"service_id"`
	Service     Service       `json:"service"`
	Name        string        `json:"name"`
	Description string        `json:"description"`
	Parameters  []ActionParam `json:"parameters"`
}

type ActionParam struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Type        string `json:"type"`
	ActionID    uint
}

type Reaction struct {
	gorm.Model
	ServiceID   uint            `json:"service_id"`
	Service     Service         `json:"service"`
	Name        string          `json:"name"`
	Description string          `json:"description"`
	Parameters  []ReactionParam `json:"parameters"`
}

type ReactionParam struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Type        string `json:"type"`
	ReactionID  uint
}
