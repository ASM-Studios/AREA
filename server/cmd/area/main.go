package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"
        "math/rand"

	"AREA/internal/amqp"
	"AREA/internal/config"
	"AREA/internal/gconsts"
	"AREA/internal/mail"
	"AREA/internal/models"
	"AREA/internal/pkg"
	"AREA/internal/routers"
	"AREA/internal/utils"

	"github.com/gin-gonic/gin"
	"github.com/rabbitmq/amqp091-go"
)

func initRMQConnection() {
        var connection amqp.Connection
        err := connection.Init(utils.GetEnvVar("RMQ_URL"))
        if err != nil {
                log.Fatalf("Failed to initialize connection: %v", err)
                return
        }
        gconsts.Connection = &connection
}

func sendWorkflows() {
        rows, err := pkg.DB.Table("workflows").Rows()
        if err != nil {
                return
        }
        defer rows.Close()
        for rows.Next() {
                var workflow models.Workflow
                pkg.DB.ScanRows(rows, &workflow)
                body, _ := json.Marshal(workflow)
                gconsts.Connection.Channel.Publish("", "action", false, false, amqp091.Publishing{
                        ContentType: "application/json",
                        Body:        body,
                })
        }
}

func autoTrigger() {
        ticker := time.NewTicker(time.Duration(config.AppConfig.TriggerInterval) * time.Second)
        quit := make(chan struct{})
        go func() {
                for {
                        select {
                        case <-ticker.C:
                                fmt.Println("Auto trigger")
                                sendWorkflows()
                        case <-quit:
                                ticker.Stop()
                                return
                        }
                }
        }()
}

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
        rand.Seed(time.Now().UnixNano())
        config.LoadConfig()

        sqlDB := pkg.InitDB()
        if sqlDB == nil {
                log.Fatal("Failed to initialize database")
        }
        defer sqlDB.Close()

        mail.InitSMTPClient()
        pkg.InitServiceList()

        rmq, err := pkg.InitRabbitMQ()
        if err != nil {
                log.Fatalf("Failed to initialize RabbitMQ: %v", err)
        }
        defer rmq.Close()

        initRMQConnection()

        autoTrigger()
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
