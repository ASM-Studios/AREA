package amqp

import "github.com/rabbitmq/amqp091-go"

type Connection struct {
        Connection      *amqp091.Connection
        Channel         *amqp091.Channel
}

func (connection *Connection) Init(url string/*, name string, exchangeType string*/) error {
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

/*func DeclareExchange(connection *Connection, name string, exchangeType string) error {
        err := connection.channel.ExchangeDeclare(
                name,           // Exchange name
                exchangeType,   // Exchange type
                true,           // Durable
                false,          // Auto-deleted
                false,          // Internal
                false,          // No-wait
                nil,            // Arguments
        )
        return err
}*/

/*func (exchange *Exchange) DeclareQueue(messageQueue string, key string) error {
        exchange.channel.QueueDeclare(
                messageQueue,   // Queue name
                true,           // Durable
                false,          // Delete when unused
                false,          // Exclusive
                false,          // No-wait
                nil,            // Arguments
        )
        exchange.channel.QueueBind(
                messageQueue,   // Queue name
                key,            // Routing key
                exchange.name,  // Exchange name
                false,          // No-wait
                nil,            // Arguments
        )
        return nil
}*/
