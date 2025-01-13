package mocks

import (
	"github.com/stretchr/testify/mock"
)

type MockRabbitMQ struct {
	mock.Mock
}

func (m *MockRabbitMQ) IsClosed() bool {
	args := m.Called()
	return args.Bool(0)
}
