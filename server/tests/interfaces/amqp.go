package interfaces

import amqp "github.com/rabbitmq/amqp091-go"

type AMQPConnection interface {
    Channel() (AMQPChannel, error)
    Close() error
}

type AMQPChannel interface {
    QueueDeclare(name string, durable, autoDelete, exclusive, noWait bool, args amqp.Table) (amqp.Queue, error)
    Publish(exchange, key string, mandatory, immediate bool, msg amqp.Publishing) error
    Close() error
}

func NewRealConnection(c *amqp.Connection) AMQPConnection {
    return &RealConnection{c}
}

var AmqpDial = func(connectionString string) (AMQPConnection, error) {
    
    conn, err := amqp.Dial(connectionString)
    if err != nil {
        return nil, err
    }
    
    // Wrap the raw connection with your adapter
    return NewRealConnection(conn), nil
}

type RealConnection struct {
    *amqp.Connection
}

func (rc *RealConnection) Channel() (AMQPChannel, error) {
    ch, err := rc.Connection.Channel()
    if err != nil {
        return nil, err
    }
    return &realChannel{ch}, nil
}

type realChannel struct {
    *amqp.Channel
}

func (rc *realChannel) QueueDeclare(name string, durable, autoDelete, exclusive, noWait bool, args amqp.Table) (amqp.Queue, error) {
    return rc.Channel.QueueDeclare(name, durable, autoDelete, exclusive, noWait, args)
}

func (rc *realChannel) Publish(exchange, key string, mandatory, immediate bool, msg amqp.Publishing) error {
    return rc.Channel.Publish(exchange, key, mandatory, immediate, msg)
}
