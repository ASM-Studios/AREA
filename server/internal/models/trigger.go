package models

import "gorm.io/gorm"

type Trigger struct {
	gorm.Model
	ServiceID   uint
	Service     Service
	Name        string
	Description string
	Endpoint    string
}
