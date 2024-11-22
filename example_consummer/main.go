package main

import (
	"consumer/consts"
	"consumer/handlers"
	"consumer/utils"
)

func main() {
	connectionString := utils.GetEnvVar("RMQ_URL")

	messageQueue := utils.RMQConsumer{
		Queue:            consts.MessageQueue,
		ConnectionString: connectionString,
		MsgHandler:       handlers.HandleMessage,
	}
	forever := make(chan bool)

	go messageQueue.Consume()

	<-forever
}
