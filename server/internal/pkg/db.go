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

func InitDB() error {
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
	}
	err = DB.AutoMigrate(
		&models.Service{},
		&models.Action{},
		&models.ActionParam{},
		&models.Reaction{},
		&models.ReactionParam{},
	)
	if err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
		return err
	}
	utils.SeedData(DB)
	log.Println("Database connection established")
	return nil
}
