package models

import "gorm.io/gorm"

type Token struct {
        gorm.Model
        Value string
        DisplayName string
        Email string
        ServiceID uint
        UserID uint
}
