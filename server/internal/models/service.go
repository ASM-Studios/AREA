package models

import "gorm.io/gorm"

type Service struct {
	gorm.Model
	Label string `json:"label"`
}
