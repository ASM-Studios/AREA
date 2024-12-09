package main

import (
	"log"
	"os"
	"os/signal"
	"service/pkg"
	"service/utils"
	"syscall"
)

func main() {
	rabbitMQConnection := utils.GetEnvVar("RMQ_URL")
	pkg.InitDB()
	err := pkg.Consumer.Init(rabbitMQConnection)
	if err != nil {
		log.Fatalf("Failed to initialize consumer: %v", err)
	}
	go func() {
		c := make(chan os.Signal, 1)
		signal.Notify(c, os.Interrupt, syscall.SIGTERM)
		<-c
		log.Println("Shutting down consumer...")
		pkg.Consumer.Close()
		os.Exit(0)
	}()

	pkg.Consumer.StartConsuming()
}
