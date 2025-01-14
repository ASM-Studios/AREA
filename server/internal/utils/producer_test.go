package utils

import (
    "AREA/tests/interfaces"
    "errors"
    "testing"
)

func TestPublishMessage_FailToConnect(t *testing.T) {
    producer := RMQProducer{
        Queue:            "test-queue",
        ConnectionString: "amqp://bad_connection",
    }
    
    interfaces.AmqpDial = func(connStr string) (interfaces.AMQPConnection, error) {
        return nil, errors.New("failed to connect")
    }
    defer func() {
        interfaces.AmqpDial = func(connStr string) (interfaces.AMQPConnection, error) {
            return &interfaces.RealConnection{}, nil
        }
    }()
    producer.PublishMessage("application/json", []byte(`{"test":"message"}`))
}
