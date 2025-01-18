package pkg

import (
	"AREA/internal/gconsts"
	"AREA/internal/models"
	"errors"
	"github.com/goccy/go-json"
	"gorm.io/gorm"
	"io/ioutil"
	"log"
	"path/filepath"
)

func InitServiceList() {
	files, err := filepath.Glob(filepath.Join(gconsts.ServiceFileDirectory, "*.json"))
	if err != nil {
		log.Println("Error loading service files:", err)
		return
	}

	var services []models.Service
	for _, file := range files {
		data, err := ioutil.ReadFile(file)
		if err != nil {
			log.Printf("Error reading file %s: %v", file, err)
			continue
		}
		var srv models.Service
		err = json.Unmarshal(data, &srv)
		if err != nil {
			log.Printf("Error unmarshalling file %s: %v", file, err)
			continue
		}
		if err := processService(&srv); err != nil {
			log.Printf("Error processing service '%s': %v", srv.Name, err)
			continue
		}
		services = append(services, srv)
	}

	log.Printf("Loaded %d services at startup in db.", len(services))
}

func processService(srv *models.Service) error {
	var existingService models.Service
	err := DB.Where("name = ?", srv.Name).First(&existingService).Error
	if err == nil {
		return updateService(srv, &existingService)
	} else if errors.Is(err, gorm.ErrRecordNotFound) {
		if err := DB.Create(srv).Error; err != nil {
			return err
		}
		log.Printf("Created new service '%s' in the database.", srv.Name)
		return nil
	}
	return err
}

func updateService(newService *models.Service, existingService *models.Service) error {
	for _, newEvent := range newService.Events {
		if err := processEvent(newEvent, existingService.ID); err != nil {
			log.Printf("Error processing event '%s': %v", newEvent.Name, err)
		}
	}

	log.Printf("Updated existing service '%s' in the database.", existingService.Name)
	return DB.Save(existingService).Error
}

func processEvent(newEvent models.Event, serviceID uint) error {
	var existingEvent models.Event
	err := DB.Where("name = ? AND service_id = ?", newEvent.Name, serviceID).First(&existingEvent).Error
	if err == nil {
		return updateEvent(newEvent, &existingEvent)
	} else if errors.Is(err, gorm.ErrRecordNotFound) {
		newEvent.ServiceID = serviceID
		if err := DB.Create(&newEvent).Error; err != nil {
			return err
		}
		log.Printf("Created new event '%s' in the database.", newEvent.Name)
		return nil
	}
	return err
}

func updateEvent(newEvent models.Event, existingEvent *models.Event) error {
	for _, newParam := range newEvent.Parameters {
		if err := processParameter(newParam, existingEvent.ID); err != nil {
			log.Printf("Error processing parameter '%s': %v", newParam.Name, err)
		}
	}
	existingEvent.Description = newEvent.Description
	existingEvent.Type = newEvent.Type
	return DB.Save(existingEvent).Error
}

func processParameter(newParam models.Parameters, eventID uint) error {
	var existingParam models.Parameters
	err := DB.Where("name = ? AND event_id = ?", newParam.Name, eventID).First(&existingParam).Error
	if err == nil {
		existingParam.Description = newParam.Description
		existingParam.Type = newParam.Type
		return DB.Save(&existingParam).Error
	} else if errors.Is(err, gorm.ErrRecordNotFound) {
		newParam.EventID = eventID
		if err := DB.Create(&newParam).Error; err != nil {
			return err
		}
		log.Printf("Created new parameter '%s' in the database.", newParam.Name)
		return nil
	}
	return err
}
