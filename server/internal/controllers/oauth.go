package controllers

import (
	"github.com/gin-gonic/gin"
)

func Google(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "Google",
	})
}
