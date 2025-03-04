package utils

import (
	"AREA/internal/gconsts"
	amqp "github.com/rabbitmq/amqp091-go"
	"github.com/rs/zerolog/log"
)

type RMQProducer struct {
	Queue            string
	ConnectionString string
}

func (x RMQProducer) OnError(err error, msg string) {
	if err != nil {
		log.Err(err).Msgf("Error occurred while publishing message on '%s' queue. Error message: %s", x.Queue, msg)
	}
}

func (x RMQProducer) PublishMessage(contentType string, body []byte) {
	conn, err := amqp.Dial(x.ConnectionString)
	x.OnError(err, "Failed to connect to RabbitMQ")
	if err != nil {
		return
	}
	defer conn.Close()

	ch, err := conn.Channel()
	x.OnError(err, "Failed to open a channel")
	if err != nil {
		return
	}
	defer ch.Close()

	q, err := ch.QueueDeclare(
		x.Queue, // name
		false,   // durable
		false,   // delete when unused
		false,   // exclusive
		false,   // no-wait
		nil,     // arguments
	)
	x.OnError(err, "Failed to declare a queue")

	err = ch.Publish(
		gconsts.ExchangeName, // exchange
		q.Name,               // routing key
		false,                // mandatory
		false,                // immediate
		amqp.Publishing{
			ContentType: contentType,
			Body:        body,
		})
	x.OnError(err, "Failed to publish a message")
}
