package models

type Parameter struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Type        string `json:"type"`
}

type Action struct {
	Id          uint        `json:"id"`
	Name        string      `json:"name"`
	Description string      `json:"description"`
	Parameters  []Parameter `json:"parameters"`
}

type Reaction struct {
	Id          uint        `json:"id"`
	Name        string      `json:"name"`
	Description string      `json:"description"`
	Parameters  []Parameter `json:"parameters"`
}

type ServiceList struct {
	Id       uint       `json:"id"`
	Name     string     `json:"name"`
	Actions  []Action   `json:"actions"`
	Reaction []Reaction `json:"reactions"`
}
