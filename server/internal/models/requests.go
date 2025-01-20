package models

type A2FMethod struct {
        Method  string  `json:"method" binding:"required"`
}

type A2FRequest struct {
        Code    string  `json:"code" binding:"required"`
}

// LoginRequest represents the payload for user login.
// @Description Request payload for user login.
// @Param email body string true "User's email address"
// @Param password body string true "User's password"
type LoginRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// RegisterRequest represents the payload for user registration.
// @Description Request payload for registering a new user.
// @Param email body string true "User's email address"
// @Param username body string true "Desired username"
// @Param password body string true "User's password"
type RegisterRequest struct {
	Email    string `json:"email" binding:"required"`
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// WorkflowCreationRequest represents the payload for creating a new workflow.
// @Description Request payload for creating a new workflow, including its services, events, and parameters.
// @Param services body []int false "List of service IDs associated with the workflow"
// @Param name body string true "Name of the workflow"
// @Param description body string true "Description of the workflow"
// @Param events body []object true "List of events associated with the workflow"
// @Param events[].id body uint true "Event ID"
// @Param events[].name body string true "Event name"
// @Param events[].description body string true "Event description"
// @Param events[].type body string true "Type of the event"
// @Param events[].parameters body []object false "List of parameters for the event"
// @Param events[].parameters[].name body string true "Parameter name"
// @Param events[].parameters[].type body string true "Parameter type"
// @Param events[].parameters[].value body string true "Parameter value"
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

// ServiceRequest represents the payload for a service request.
// @Description Represents a service associated with a workflow.
// @Param id body uint true "Service ID"
// @Param name body string true "Service name"
type ServiceRequest struct {
	ID          uint   `json:"id"`
	Name        string `json:"name"`
	ConnectedAt string `json:"connectedAt"`
}

// UserRequest represents the response structure for user details.
// @Description Response structure for user details, including associated services.
// @Param username body string true "Username of the user"
// @Param email body string true "Email address of the user"
// @Param services body []ServiceRequest false "List of services associated with the user"
type UserRequest struct {
        Username        string                  `json:"username"`
        Email           string                  `json:"email"`
        ValidEmail      bool                    `json:"valid_email"`
        TwoFactorMethod string                  `gorm:"type:enum('none', 'mail', 'totp');not null" binding:"required" json:"two_factor_method"`
        Services        []ServiceRequest        `json:"services"`
}

// ParametersRequest represents a parameter associated with an event.
// @Description Represents a parameter with its name, type, and value.
// @Param name body string true "Parameter name"
// @Param type body string true "Parameter type"
// @Param value body string true "Parameter value"
type ParametersRequest struct {
	Name  string  `json:"name"`
	Type  string  `json:"type"`
	Value *string `json:"value,omitempty"`
}

// EventRequest represents an event within a workflow.
// @Description Represents an event with its name, type, description, and associated parameters.
// @Param id body uint true "Event ID"
// @Param name body string true "Event name"
// @Param type body string true "Type of the event"
// @Param description body string true "Description of the event"
// @Param parameters body []ParametersRequest false "List of parameters associated with the event"
type EventRequest struct {
	Id          uint                 `json:"id"`
	Name        string               `json:"name"`
	Type        EventType            `json:"type"`
	Description string               `json:"description"`
	Parameters  *[]ParametersRequest `json:"parameters,omitempty"`
}

// WorkflowRequest represents the structure of a workflow update or creation request.
// @Description Structure for workflow creation or update.
// @Param description body string false "Workflow description"
// @Param name body string false "Workflow name"
// @Param is_active body boolean false "Whether the workflow is active"
// @Param events body []EventRequest false "List of events associated with the workflow"
type WorkflowRequest struct {
	Name        *string         `json:"name,omitempty"`
	Description *string         `json:"description,omitempty"`
	Services    *[]uint         `json:"services,omitempty"`
	Events      *[]EventRequest `json:"events,omitempty"`
	IsActive    *bool           `json:"is_active,omitempty"`
}
