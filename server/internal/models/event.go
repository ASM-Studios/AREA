package models

import (
    "errors"
    "github.com/goccy/go-json"
    "gorm.io/gorm"
)

type WorkflowStatus string

type Variables struct {
    gorm.Model
    Value   string `json:"value"`
    EventID uint   `gorm:"foreignKey:EventID" json:"event_id"`
}

type VariablesList []Variables

func (v *VariablesList) UnmarshalJSON(data []byte) error {
    var arr []string
    if err := json.Unmarshal(data, &arr); err == nil {
        var result []Variables
        for _, s := range arr {
            result = append(result, Variables{Value: s})
        }
        *v = result
        return nil
    }
    return errors.New("invalid format for variables (expected an array of strings)")
}

func (v VariablesList) GetVariables() []string {
    var values []string
    for _, variable := range v {
        values = append(values, variable.Value)
    }
    return values
}

type Event struct {
    gorm.Model
    ShortName      string          `json:"short_name"`
    Name           string          `json:"name"`
    Description    string          `json:"description"`
    ServiceID      uint            `gorm:"foreignKey:ServiceID" json:"service_id"`
    Variables      VariablesList   `gorm:"constraint:OnDelete:CASCADE;" json:"variables"`
    Parameters     []Parameters    `json:"parameters"`
    Type           EventType       `gorm:"type:enum('action', 'reaction');not null" json:"type"`
    WorkflowEvents []WorkflowEvent `gorm:"constraint:OnDelete:CASCADE;" json:"workflow_events"`
}

const (
    WorkflowStatusPending   WorkflowStatus = "pending"
    WorkflowStatusProcessed WorkflowStatus = "processed"
    WorkflowStatusFailed    WorkflowStatus = "failed"
)
