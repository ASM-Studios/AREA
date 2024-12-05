package controllers

import (
	"AREA/internal/pkg"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Google(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "Google",
	})
}

type Token struct {
        Token   string
}

func OAuth(c *gin.Context) {
        var token Token
        err := c.ShouldBindJSON(&token)
        if err != nil {
                c.AbortWithStatus(http.StatusBadRequest)
                return
        }
        userId, err := pkg.GetUserFromToken(c)
        if err != nil {
                c.AbortWithStatusJSON(http.StatusBadRequest, gin.H {
                        "message": "User not found",
                })
                return
        }
        serviceId, err := pkg.GetServiceFromName(c.Param("service"))
        if err != nil {
                c.AbortWithStatusJSON(http.StatusBadRequest, gin.H {
                        "message": "Service not found",
                })
                return
        }
        fmt.Println(userId, serviceId)
}
