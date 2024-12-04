package pkg

import (
	"AREA/internal/models"
	"AREA/internal/utils"
	"fmt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"log"
)

var DB *gorm.DB

func migrateDB() error {
	err := DB.AutoMigrate(
		&models.User{},
		&models.Workflow{},
		&models.Event{},
		&models.Parameters{},
		&models.Service{},
	)
	if err != nil {
		log.Fatalf("Failed to migrate DB: %v", err)
	}
	return err
}

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
		log.Fatalf("Failed to connect database: %v", err)
		return
	}
	log.Println("Database connection established")
	if migrateDB() != nil {
		return
	}
	log.Println("Migration done")
}
