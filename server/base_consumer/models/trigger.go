package models

import (
	"encoding/json"
	"fmt"
	"gorm.io/gorm"
	"strconv"
	"time"
)

type Trigger struct {
	gorm.Model
	ServiceID   uint
	Service     Service
	Name        string
	Description string
	Endpoint    string
}

type TriggerEvent struct {
	gorm.Model
	AppletID    uint
	TriggerID   uint
	Payload     json.RawMessage `gorm:"type:json"`
	ProcessedAt *time.Time
	Status      EventStatus
}

func (e *TriggerEvent) UnmarshalJSON(data []byte) error {
	type Alias TriggerEvent
	aux := &struct {
		ID string `json:"id"`
		*Alias
	}{
		Alias: (*Alias)(e),
	}
	if err := json.Unmarshal(data, aux); err != nil {
		return err
	}
	if aux.ID != "" {
		idUint, err := strconv.ParseUint(aux.ID, 10, 32)
		if err != nil {
			return fmt.Errorf("invalid ID format: %w", err)
		}
		e.ID = uint(idUint)
	}
	return nil
}
