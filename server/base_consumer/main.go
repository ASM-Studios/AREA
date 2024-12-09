package main

import (
	"log"
	"service/pkg"
	"service/utils"
)

func main() {
	rabbitMQConnection := utils.GetEnvVar("RMQ_URL")
	pkg.InitDB()
	consumer := &utils.EventConsumer{}
	err := consumer.Init(rabbitMQConnection)
	if err != nil {
		log.Fatalf("Failed to initialize event consumer: %v", err)
	}
	err = consumer.ConsumeEvents()
	if err != nil {
		log.Fatalf("Failed to consume trigger events: %v", err)
	}
}
