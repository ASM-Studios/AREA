package models

type LoginRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type RegisterRequest struct {
	Email    string `json:"email" binding:"required"`
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type WorkflowCreationRequest struct {
	Services    []int  `json:"services"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Events      []struct {
		ID          uint      `json:"id"`
		Name        string    `json:"name"`
		Description string    `json:"description"`
		Type        EventType `json:"type"`
		Parameters  []struct {
			Name  string `json:"name"`
			Type  string `json:"type"`
			Value string `json:"value"`
		} `json:"parameters"`
	} `json:"events"`
}
