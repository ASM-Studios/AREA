package models

import "gorm.io/gorm"

type Service struct {
	gorm.Model
	Name   string  `json:"name"`
	Events []Event `gorm:"constraint:OnDelete:CASCADE;" json:"events"`
}
