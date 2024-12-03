package pkg

import (
	"fmt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"log"
	"service/utils"
)

func InitDB() (*gorm.DB, error) {
	dbHost := utils.GetEnvVar("DB_HOST")
	dbPort := utils.GetEnvVar("DB_PORT")
	dbName := utils.GetEnvVar("DB_NAME")
	user := utils.GetEnvVar("DB_USER")
	password := utils.GetEnvVar("DB_PASSWORD")
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", user, password, dbHost, dbPort, dbName)
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect database: %v", err)
	}
	if err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
		return nil, err
	}
	log.Println("Database connection established")
	return db, nil
}
