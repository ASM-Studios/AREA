package models

type parameter struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Type        string `json:"type"`
}

type action struct {
	Name        string      `json:"name"`
	Description string      `json:"description"`
	Parameters  []parameter `json:"parameters"`
}

type reaction struct {
	Name        string      `json:"name"`
	Description string      `json:"description"`
	Parameters  []parameter `json:"parameters"`
}

type ServiceList struct {
	Name     string     `json:"name"`
	Actions  []action   `json:"actions"`
	Reaction []reaction `json:"reactions"`
}
