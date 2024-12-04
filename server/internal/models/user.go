package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Email    string `gorm:"unique;not null" json:"email" binding:"required"`
	Username string `gorm:"unique;not null" json:"username" binding:"required"`
	Password string `gorm:"not null" json:"password" binding:"required"`
	Salt     string `gorm:"not null" json:"salt"`
	Token    string `gorm:"not null" json:"token"`
}
