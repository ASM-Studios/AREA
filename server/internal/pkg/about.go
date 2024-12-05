package pkg

import (
	"AREA/internal/consts"
	"AREA/internal/models"
	"github.com/goccy/go-json"
	"io/ioutil"
	"log"
	"path/filepath"
)

func InitServiceList() {
	files, err := filepath.Glob(filepath.Join(consts.ServiceFileDirectory, "*.json"))
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
		//DB.Create(&srv)

		services = append(services, srv)
	}
	//create or update services
	value := DB.Clauses(models.Service{}).Create(services)
	if value.Error != nil {
		log.Printf("Error saving services in db: %v", value.Error)
		return
	}
	log.Printf("Loaded %d services at startup in db.", len(services))

}
