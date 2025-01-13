package services

import (
	"AREA/tests/mocks"
	"database/sql"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestHealthService_Check(t *testing.T) {
	tests := []struct {
		name           string
		mockDBError    error
		mockRabbitMQOK bool
		expectedStatus string
	}{
		{
			name:           "All services healthy",
			mockDBError:    nil,
			mockRabbitMQOK: true,
			expectedStatus: "ok",
		},
		{
			name:           "Database connection failed",
			mockDBError:    sql.ErrConnDone,
			mockRabbitMQOK: true,
			expectedStatus: "error",
		},
		{
			name:           "RabbitMQ connection closed",
			mockDBError:    nil,
			mockRabbitMQOK: false,
			expectedStatus: "error",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockDB := new(mocks.MockDB)
			mockRabbitMQ := new(mocks.MockRabbitMQ)

			mockDB.On("Ping").Return(tt.mockDBError)
			mockRabbitMQ.On("IsClosed").Return(!tt.mockRabbitMQOK)

			healthService := &HealthService{
				db:  mockDB,
				rmq: mockRabbitMQ,
			}

			status := healthService.Check()

			assert.Equal(t, tt.expectedStatus, status.Status)
			mockDB.AssertExpectations(t)
			mockRabbitMQ.AssertExpectations(t)
		})
	}
}

func TestHealthService_checkDatabase(t *testing.T) {
	tests := []struct {
		name        string
		mockDBError error
		expected    ComponentCheck
	}{
		{
			name:        "Database connection successful",
			mockDBError: nil,
			expected:    ComponentCheck{Status: "ok"},
		},
		{
			name:        "Database connection failed",
			mockDBError: sql.ErrConnDone,
			expected:    ComponentCheck{Status: "error", Message: "Database connection failed"},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockDB := new(mocks.MockDB)
			mockDB.On("Ping").Return(tt.mockDBError)

			healthService := &HealthService{db: mockDB}

			result := healthService.checkDatabase()
			assert.Equal(t, tt.expected, result)
			mockDB.AssertExpectations(t)
		})
	}
}

func TestHealthService_checkRabbitMQ(t *testing.T) {
	tests := []struct {
		name         string
		mockIsClosed bool
		expected     ComponentCheck
	}{
		{
			name:         "RabbitMQ connection open",
			mockIsClosed: false,
			expected:     ComponentCheck{Status: "ok"},
		},
		{
			name:         "RabbitMQ connection closed",
			mockIsClosed: true,
			expected:     ComponentCheck{Status: "error", Message: "RabbitMQ connection is closed"},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockRabbitMQ := new(mocks.MockRabbitMQ)
			mockRabbitMQ.On("IsClosed").Return(tt.mockIsClosed)

			healthService := &HealthService{rmq: mockRabbitMQ}

			result := healthService.checkRabbitMQ()
			assert.Equal(t, tt.expected, result)
			mockRabbitMQ.AssertExpectations(t)
		})
	}
}

func TestInitHealthService(t *testing.T) {
	mockDB := new(mocks.MockDB)
	mockRabbitMQ := new(mocks.MockRabbitMQ)

	InitHealthService(mockDB, mockRabbitMQ)
	healthService := GetHealthService()

	assert.Equal(t, mockDB, healthService.db)
	assert.Equal(t, mockRabbitMQ, healthService.rmq)
}

func TestNewHealthService(t *testing.T) {
	mockDB := new(mocks.MockDB)
	mockRabbitMQ := new(mocks.MockRabbitMQ)

	healthService := NewHealthService(mockDB, mockRabbitMQ)

	assert.Equal(t, mockDB, healthService.db)
	assert.Equal(t, mockRabbitMQ, healthService.rmq)
}
