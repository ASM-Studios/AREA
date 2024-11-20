package controllers

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
	"time"
)

type action struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

type reaction struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

type service struct {
	Name     string     `json:"name"`
	Actions  []action   `json:"actions"`
	Reaction []reaction `json:"reaction"`
}

func getServiceList() []service {
	return []service{
		{
			Name: "mail",
			Actions: []action{
				{
					Name:        "send",
					Description: "send mail",
				},
			},
			Reaction: []reaction{
				{
					Name:        "receive",
					Description: "receive mail",
				},
			},
		},
	}
}

// About godoc
// @Summary About
// @Description about
// @Tags about
// @Accept  json
// @Produce  json
// @Success 200 {msg} string
// @Router /about.json [get]
func About(c *gin.Context) {
	var msg struct {
		Client struct {
			Host string `json:"host"`
		} `json:"client"`
		Server struct {
			CurrentTime string `json:"current_time"`
			Services    []service
		} `json:"server"`
	}
	msg.Client.Host = c.ClientIP()
	msg.Server.CurrentTime = strconv.FormatInt(time.Now().Unix(), 10)
	msg.Server.Services = getServiceList()
	c.JSON(http.StatusOK, msg)
}
