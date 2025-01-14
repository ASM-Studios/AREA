package mocks

import (
	"AREA/tests/interfaces"
	amqp "github.com/rabbitmq/amqp091-go"
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

// MockAMQPConnection is a mock implementation of AMQPConnection.
type MockAMQPConnection struct {
	mock.Mock
}

func (m *MockAMQPConnection) Channel() (interfaces.AMQPChannel, error) {
	args := m.Called()
	return args.Get(0).(interfaces.AMQPChannel), args.Error(1)
}

func (m *MockAMQPConnection) Close() error {
	args := m.Called()
	return args.Error(0)
}

type MockAMQPChannel struct {
	mock.Mock
}

func (m *MockAMQPChannel) QueueDeclare(name string, durable, autoDelete, exclusive, noWait bool, argsTable amqp.Table) (amqp.Queue, error) {
	args := m.Called(name, durable, autoDelete, exclusive, noWait, argsTable)
	return args.Get(0).(amqp.Queue), args.Error(1)
}

func (m *MockAMQPChannel) Publish(exchange, key string, mandatory, immediate bool, msg amqp.Publishing) error {
	argsCall := m.Called(exchange, key, mandatory, immediate, msg)
	return argsCall.Error(0)
}

func (m *MockAMQPChannel) Close() error {
	args := m.Called()
	return args.Error(0)
}
