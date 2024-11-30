package db

import (
	"AREA/internal/utils"
	"fmt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"log"
)

var DB *gorm.DB

func InitDB() {
	dbHost := utils.GetEnvVar("DB_HOST")
	dbPort := utils.GetEnvVar("DB_PORT")
	dbName := utils.GetEnvVar("DB_NAME")
	user := utils.GetEnvVar("DB_USER")
	password := utils.GetEnvVar("DB_PASSWORD")
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", user, password, dbHost, dbPort, dbName)
	err := error(nil)
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to initialize database, got error %v", err)
	}
	fmt.Println("Database connection established")
}
