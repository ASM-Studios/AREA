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

func (m *MockRabbitMQ) Publish(queue string, body []byte) error {
    args := m.Called(queue, body)
    return args.Error(0)
}

func (m *MockRabbitMQ) Consume(queue string) (<-chan []byte, error) {
    args := m.Called(queue)
    return args.Get(0).(<-chan []byte), args.Error(1)
}
