package main

import (
	"consumer/consts"
	"consumer/handlers"
	"consumer/utils"
	"github.com/rs/zerolog/log"
	"net/http"
)

func main() {
	http.HandleFunc("/auth/google/login", utils.GetAuthURL)
	http.HandleFunc("/auth/google/callback", utils.HandleGoogleCallback)
	log.Info().Msg("Server started successfully on port http://localhost:8042")
	log.Info().Msg("Login with Google at http://localhost:8042/auth/google/login")
	log.Info().Msg("Callback URL: http://localhost:8042/auth/google/callback")
	connectionString := utils.GetEnvVar("RMQ_URL")

	messageQueue := utils.RMQConsumer{
		Queue:            consts.MessageQueue,
		ConnectionString: connectionString,
		MsgHandler:       handlers.HandleMessage,
	}
	forever := make(chan bool)

	go messageQueue.Consume()
	err := http.ListenAndServe(":8042", nil)
	if err != nil {
		log.Fatal().Err(err).Msg("Server failed to start")
	}
	<-forever

}
