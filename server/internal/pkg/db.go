package db

import (
	"AREA/internal/config"
	"fmt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"log"
	"strconv"
)

var DB *gorm.DB

func InitDB() {

	user := config.AppConfig.DB.User
	password := config.AppConfig.DB.Password
	dsn := user + ":" + password + "@tcp(" + config.AppConfig.DB.Host + ":" + strconv.Itoa(config.AppConfig.DB.Port) + ")/" + config.AppConfig.DB.Name + "?parseTime=true"
	err := error(nil)
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to initialize database, got error %v", err)
	}
	fmt.Println("Database connection established")
}
