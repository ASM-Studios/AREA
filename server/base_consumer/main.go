package main

import (
	"log"
	"service/pkg"
	"service/utils"
)

func main() {
	rabbitMQConnection := utils.GetEnvVar("RMQ_URL")
	db, err := pkg.InitDB()
	if err != nil {
		return
	}
	consumer := &utils.EventConsumer{}
	err = consumer.Init(rabbitMQConnection, db)
	if err != nil {
		log.Fatalf("Failed to initialize event consumer: %v", err)
	}
	err = consumer.ConsumeEvents()
	if err != nil {
		log.Fatalf("Failed to consume trigger events: %v", err)
	}
}
