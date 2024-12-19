package models

import "gorm.io/gorm"

type Token struct {
        gorm.Model
        Token           string
        RefreshToken    string
        ExpiresIn       int
        DisplayName     string
        Email           string
        ServiceID       uint
        UserID          uint
}
