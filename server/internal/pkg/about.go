package pkg

import (
	"AREA/internal/consts"
	"AREA/internal/models"
	"github.com/goccy/go-json"
	"io/ioutil"
	"log"
	"path/filepath"
)

var CachedServices []models.ServiceList

func InitServiceList() {
	files, err := filepath.Glob(filepath.Join(consts.ServiceFileDirectory, "*.json"))
	if err != nil {
		log.Println("Error loading service files:", err)
		return
	}

	var services []models.ServiceList
	for _, file := range files {
		data, err := ioutil.ReadFile(file)
		if err != nil {
			log.Printf("Error reading file %s: %v", file, err)
			continue
		}

		var srv models.ServiceList
		err = json.Unmarshal(data, &srv)
		if err != nil {
			log.Printf("Error unmarshalling file %s: %v", file, err)
			continue
		}

		services = append(services, srv)
	}

	CachedServices = services
	log.Printf("Loaded %d services at startup.", len(CachedServices))
}
