package main

import (
	"fmt"
	"log"
	"net/http"
	"strconv"

	"AREA/internal/config"
	"AREA/internal/pkg"
	"AREA/internal/routers"

	"github.com/gin-gonic/gin"
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

	sqlDB := pkg.InitDB()
	if sqlDB == nil {
		log.Fatal("Failed to initialize database")
	}
	defer sqlDB.Close()
	pkg.InitServiceList()
	rmq, err := pkg.InitRabbitMQ()
	if err != nil {
		log.Fatalf("Failed to initialize RabbitMQ: %v", err)
	}
	defer rmq.Close()

	gin.SetMode(config.AppConfig.GinMode)
	router := routers.SetupRouter(sqlDB, rmq)
	port := strconv.Itoa(config.AppConfig.Port)
	log.Printf("Starting %s on port %s in %s mode", config.AppConfig.AppName, port, config.AppConfig.GinMode)

	server := &http.Server{
		Addr:    fmt.Sprintf(":%s", port),
		Handler: router,
	}

	if err := server.ListenAndServe(); err != nil {
		log.Printf("Server error: %v", err)
	}
}
