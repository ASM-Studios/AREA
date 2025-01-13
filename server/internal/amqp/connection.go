package amqp

import "github.com/rabbitmq/amqp091-go"

type Connection struct {
        Connection      *amqp091.Connection
        Channel         *amqp091.Channel
}

func (connection *Connection) Init(url string) error {
        _connection, err := amqp091.Dial(url)
        if err != nil {
                return err
        }
        connection.Connection = _connection

        channel, err := connection.Connection.Channel()
        if err != nil {
                return err
        }
        connection.Channel = channel
        return nil
}

func (connection *Connection) Fini() {
        connection.Channel.Close()
        connection.Connection.Close()
}
