package models

import "gorm.io/gorm"

type Service struct {
	gorm.Model
	Name        string
	Description string
	BaseURL     string
	APIKey      string
	Type        ServiceType
}

type ServiceType string

const (
	ServiceTypeTrigger ServiceType = "trigger"
	ServiceTypeAction  ServiceType = "action"
)
