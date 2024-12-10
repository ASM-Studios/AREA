package utils

import (
	"fmt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"log"
)

var DB *gorm.DB

func InitDB() {
	dbHost := GetEnvVar("DB_HOST")
	dbPort := GetEnvVar("DB_PORT")
	dbName := GetEnvVar("DB_NAME")
	user := GetEnvVar("DB_USER")
	password := GetEnvVar("DB_PASSWORD")
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", user, password, dbHost, dbPort, dbName)
	err := error(nil)
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect database: %v", err)
		return
	}
	log.Println("Database connection established")
}
