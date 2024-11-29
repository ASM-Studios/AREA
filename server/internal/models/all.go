package models

import "gorm.io/gorm"

type Subscribed struct {
	gorm.Model
	UserID      uint   `gorm:"not null" json:"user_id"`
	Provider    string `gorm:"not null" json:"provider"`
	ProviderID  string `gorm:"not null" json:"provider_id"`
	AccessToken string `gorm:"not null" json:"access_token"`
}

type Users struct {
	User       User         `gorm:"embedded"`
	Subscribed []Subscribed `gorm:"foreignKey:UserID"`
}
