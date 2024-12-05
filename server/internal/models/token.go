package models

import "gorm.io/gorm"

type Token struct {
        gorm.Model
        Value string
        ServiceID uint
        UserID uint
}
