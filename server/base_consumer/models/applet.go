package models

import (
	"encoding/json"
	"gorm.io/gorm"
)

type Applet struct {
	gorm.Model
	UserID      uint
	User        User
	Name        string
	Description string
	Active      bool
	Triggers    []AppletTrigger
	Actions     []AppletAction
}

type AppletTrigger struct {
	gorm.Model
	AppletID   uint
	TriggerID  uint
	Trigger    Trigger
	Parameters json.RawMessage `gorm:"type:json"`
}

type AppletAction struct {
	gorm.Model
	AppletID   uint
	ActionID   uint
	Action     Action
	Parameters json.RawMessage `gorm:"type:json"`
}
