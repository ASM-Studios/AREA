package controllers

import (
	"AREA/internal/models"
	"AREA/internal/pkg"
	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog/log"
	"net/http"
	"strconv"
	"time"
)

func getServiceFromType(serviceType string, service models.Service) models.ServiceList {
	if err := pkg.DB.Preload("Events", "type = ?", serviceType).
		Where("id = ?", service.ID).
		First(&service).Error; err != nil {
		log.Error().Err(err).Msg("Failed to load service with events")
		return models.ServiceList{}
	}
	var actions []models.Action
	var reactions []models.Reaction
	for _, event := range service.Events {
		pkg.DB.Preload("Parameters").Find(&event)
		var parameters []models.Parameter
		for _, param := range event.Parameters {
			parameters = append(parameters, models.Parameter{
				Name:        param.Name,
				Description: param.Description,
				Type:        param.Type,
			})
		}

		if serviceType == "action" {
			actions = append(actions, models.Action{
				Id:          event.ID,
				Name:        event.Name,
				Description: event.Description,
				Parameters:  parameters,
			})
		} else if serviceType == "reaction" {
			reactions = append(reactions, models.Reaction{
				Id:          event.ID,
				Name:        event.Name,
				Description: event.Description,
				Parameters:  parameters,
			})
		}
	}

	return models.ServiceList{
		Id:       service.ID,
		Name:     service.Name,
		Actions:  actions,
		Reaction: reactions,
	}
}

func getServices() []models.ServiceList {
	var services []models.Service
	var serviceList []models.ServiceList

	if err := pkg.DB.Preload("Events").Find(&services).Error; err != nil {
		log.Error().Err(err).Msg("Failed to load services")
		return nil
	}

	for _, service := range services {
		actions := getServiceFromType("action", service)
		reactions := getServiceFromType("reaction", service)
		serviceList = append(serviceList, models.ServiceList{
			Id:       service.ID,
			Name:     service.Name,
			Actions:  actions.Actions,
			Reaction: reactions.Reaction,
		})
	}

	return serviceList
}

// About godoc
// @Summary Get information about the server
// @Description Get information about the server
// @Tags about
// @Accept json
// @Security Bearer
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Router /about.json [get]
func About(c *gin.Context) {
	var msg struct {
		Client struct {
			Host string `json:"host"`
		} `json:"client"`
		Server struct {
			CurrentTime string               `json:"current_time"`
			Services    []models.ServiceList `json:"services"`
		} `json:"server"`
	}

	msg.Client.Host = c.ClientIP()
	msg.Server.CurrentTime = strconv.FormatInt(time.Now().Unix(), 10)
	msg.Server.Services = getServices()
	c.JSON(http.StatusOK, msg)
}
