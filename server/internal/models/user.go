package models

import (
	"gorm.io/gorm"
)

type MailCode struct {
        gorm.Model
        Code            uint    `gorm:"foreignKey:UserID;not null" json:"code"`
        UserID          uint     `json:"user_id"`
        ExpiresAt       uint    `json:"expires_at"`
}

type User struct {
	gorm.Model
	Email           string          `json:"email" binding:"required"`
        ValidEmail      bool            `json:"valid_email"`
	Username        string          `gorm:"unique" json:"username" binding:"required"`
	Password        string          `gorm:"not null" json:"password" binding:"required"`
	Salt            string          `gorm:"not null" json:"salt"`
        Token           string          `gorm:"not null" json:"token"`
        TwoFactorMethod string          `gorm:"type:enum('none', 'mail', 'totp');not null" binding:"required" json:"two_factor_method"`
        TOTP            string          `json:"totp"`
        ValidTOTP       bool            `json:"valid_totp"`
        Workflows       []Workflow      `gorm:"constraint:OnDelete:CASCADE;"`
        Tokens          []Token         `gorm:"constraint:OnDelete:CASCADE;"`
        MailCodes       []MailCode      `gorm:"constraint:OnDelete:CASCADE;"`
}
