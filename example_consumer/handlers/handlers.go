package handlers

import (
	"consumer/service"
	"consumer/utils"
	amqp "github.com/rabbitmq/amqp091-go"
	"github.com/rs/zerolog/log"
	"strings"
)

func HandleMessage(queue string, msg amqp.Delivery, err error) {
	if err != nil {
		log.Err(err).Msg("Error occurred in RMQ consumer")
	}
	log.Info().Msgf("Message received on '%s' queue: %s", queue, string(msg.Body))

	if strings.HasPrefix(string(msg.Body), "send email:") {
		parts := strings.SplitN(string(msg.Body), ":", 2)
		if len(parts) == 2 {
			email := strings.TrimSpace(parts[1])
			err := service.SendEmailTo(utils.Token, email)
			if err != nil {
				log.Err(err).Msg("Error sending email")
			} else {
				log.Info().Msgf("Email sent to %s", email)
			}
		} else {
			log.Error().Msg("Invalid message format")
		}
	}
}
