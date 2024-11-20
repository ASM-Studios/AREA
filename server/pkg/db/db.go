package db

import (
	"AREA/internal/config"
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
	"log"
)

var (
	Collection *mongo.Collection
	Client     *mongo.Client
)

func InitMongoDb() {
	//serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	println("mongo connection: %s", config.AppConfig.DB.DbUrl)
	mongoConnection := options.Client().ApplyURI(config.AppConfig.DB.DbUrl) //.SetServerAPIOptions(serverAPI)
	client, err := mongo.Connect(context.TODO(), mongoConnection)
	if err != nil {
		log.Fatal("error while connecting with mongo", err)
	}
	err = client.Ping(context.TODO(), readpref.Primary())
	if err != nil {
		log.Fatal("error while trying to ping mongo", err)
	}

	fmt.Println("mongo connection established")

	Collection = client.Database(config.AppConfig.DB.DbNAME).Collection(config.AppConfig.DB.DbCollection)
}
