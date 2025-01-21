package pkg

import (
	"AREA/internal/models"
	"AREA/internal/utils"
	"database/sql"
	"fmt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"log"
)

var DB *gorm.DB

func migrateDB() error {
	err := DB.AutoMigrate(
		&models.User{},
                &models.Secret{},
                &models.MailCode{},
		&models.Workflow{},
		&models.Service{},
		&models.Event{},
		&models.Variables{},
		&models.Parameters{},
		&models.Token{},
		&models.WorkflowEvent{},
		&models.ParametersValue{},
	)
	if err != nil {
		log.Fatalf("Failed to migrate DB: %v", err)
	}
	return err
}

func InitDB() *sql.DB {
	dbHost := utils.GetEnvVar("DB_HOST")
	dbPort := utils.GetEnvVar("DB_PORT")
	dbName := utils.GetEnvVar("DB_NAME")
	user := utils.GetEnvVar("DB_USER")
	password := utils.GetEnvVar("DB_PASSWORD")
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", user, password, dbHost, dbPort, dbName)

	var err error
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect database: %v", err)
		return nil
	}
	log.Println("Database connection established")

	if err := migrateDB(); err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
		return nil
	}
	log.Println("Migration done")

	sqlDB, err := DB.DB()
	if err != nil {
		log.Fatalf("Failed to get underlying *sql.DB: %v", err)
		return nil
	}
	return sqlDB
}
