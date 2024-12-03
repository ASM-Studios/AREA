package models

import "gorm.io/gorm"

type Action struct {
	gorm.Model
	ServiceID   uint
	Service     Service
	Name        string
	Description string
	Endpoint    string
}
