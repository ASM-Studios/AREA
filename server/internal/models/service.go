package models

import "gorm.io/gorm"

type Service struct {
	gorm.Model
	Name   string  `json:"name"`
	Events []Event `json:"events"`
}
