package mocks

import (
    "github.com/stretchr/testify/mock"
)

type MockDB struct {
    mock.Mock
}

func (m *MockDB) Ping() error {
    args := m.Called()
    return args.Error(0)
}
