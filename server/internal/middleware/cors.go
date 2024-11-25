package middleware

import (
	"AREA/internal/config"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func EnableCors() gin.HandlerFunc {
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = config.AppConfig.CorsOrigins
	corsConfig.AllowMethods = []string{"GET", "POST", "PUT", "DELETE"}
	return cors.New(corsConfig)
}
