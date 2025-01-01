package models

import "gorm.io/gorm"

type Token struct {
        gorm.Model
        Token           string
        RefreshToken    string
        DisplayName     string
        Email           string
        ServiceID       uint
        UserID          uint
        Expired         bool
}
