package models

import "gorm.io/gorm"

type Service struct {
	gorm.Model
	Name   string  `gorm:"unique;not null" json:"name"`
        Events []Event `gorm:"constraint:OnDelete:CASCADE;" json:"events"`
        Tokens []Token `gorm:"constraint:OnDelete:CASCADE;" json:"tokens"`
}
