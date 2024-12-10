package microsoft

import (
	"fmt"
)

type APIClient struct {
	Token string
}

func (c *APIClient) ValidateToken() error {
	// Add real token validation logic as needed
	return nil
}

func InitMicrosoftAPI(token string) (*APIClient, error) {
	client := &APIClient{Token: token}

	if err := client.ValidateToken(); err != nil {
		return nil, fmt.Errorf("invalid token: %w", err)
	}

	return client, nil
}
