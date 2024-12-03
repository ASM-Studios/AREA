package utils

import (
	"AREA/internal/consts"
	"AREA/internal/models"
	"encoding/json"
	"gorm.io/gorm"
	"io/ioutil"
	"log"
)

func SeedData(db *gorm.DB) {
	jsonFile, err := ioutil.ReadFile(consts.SeedFile)
	if err != nil {
		log.Fatalf("Failed to read JSON file: %v", err)
	}
	var services []models.Service
	if err := json.Unmarshal(jsonFile, &services); err != nil {
		log.Fatalf("Failed to unmarshal JSON data: %v", err)
	}
	for _, service := range services {
		// Use FirstOrCreate to avoid duplicate services
		var existingService models.Service
		if err := db.Where("name = ?", service.Name).First(&existingService).Error; err != nil {
			if err := db.Create(&service).Error; err != nil {
				log.Fatalf("Failed to insert service: %v", err)
			}
		} else {
			service.ID = existingService.ID
		}

		for _, action := range service.Actions {
			action.ServiceID = service.ID
			var existingAction models.Action
			if err := db.Where("name = ?", action.Name).First(&existingAction).Error; err != nil {
				if err := db.Create(&action).Error; err != nil {
					log.Fatalf("Failed to insert action: %v", err)
				}
			}
		}

		for _, reaction := range service.Reactions {
			reaction.ServiceID = service.ID
			var existingReaction models.Reaction
			if err := db.Where("name = ?", reaction.Name).First(&existingReaction).Error; err != nil {
				if err := db.Create(&reaction).Error; err != nil {
					log.Fatalf("Failed to insert reaction: %v", err)
				}
			}
		}
	}
}
