package models

import "gorm.io/gorm"

type Secret struct {
        gorm.Model
        UserID  uint    `gorm:"foreignKey:UserID;not null" json:"user_id"`
        Key     string  `json:"key"`
        Value   string  `json:"value"`
}
