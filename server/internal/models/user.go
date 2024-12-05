package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Email    string `json:"email" binding:"required"`
	Username string `gorm:"unique" json:"username" binding:"required"`
	Password string `gorm:"not null" json:"password" binding:"required"`
	Salt     string `gorm:"not null" json:"salt"`
        Token    string `gorm:"not null" json:"token"`
        Workflows []Workflow `gorm:"constraint:OnDelete:CASCADE;"`
        Tokens []Token `gorm:"constraint:OnDelete:CASCADE;"`
}
