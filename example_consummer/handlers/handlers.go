package handlers

import (
	amqp "github.com/rabbitmq/amqp091-go"
	"github.com/rs/zerolog/log"
)

func HandleMessage(queue string, msg amqp.Delivery, err error) {
	if err != nil {
		log.Err(err).Msg("Error occurred in RMQ consumer")
	}
	log.Info().Msgf("Message received on '%s' queue: %s", queue, string(msg.Body))
}
