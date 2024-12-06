package main

import (
	"AREA/internal/config"
	"AREA/internal/pkg"
	"AREA/internal/routers"
	"fmt"
	"github.com/gin-gonic/gin"
	"log"
	"strconv"
)

// @title           AREA API
// @version         1.0
// @description     API documentation for AREA backend
// @termsOfService  http://swagger.io/terms/

// @contact.name   API Support
// @contact.url    http://www.swagger.io/support
// @contact.email  support@example.com

// @license.name  GPL-3.0
// @license.url   https://www.gnu.org/licenses/gpl-3.0.en.html#license-text

// @host      localhost:8080
// @BasePath  /

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
func main() {
	config.LoadConfig()
	pkg.InitDB()
	pkg.InitServiceList()
	gin.SetMode(config.AppConfig.GinMode)
	router := routers.SetupRouter()
	port := strconv.Itoa(config.AppConfig.Port)
	log.Printf("Starting %s on port %s in %s mode", config.AppConfig.AppName, port, config.AppConfig.GinMode)
	if err := router.Run(fmt.Sprintf(":%s", port)); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
