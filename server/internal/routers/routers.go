package routers

import (
	_ "AREA/docs"
	"AREA/internal/config"
	"AREA/internal/controllers"
	"AREA/internal/middleware"
	"AREA/internal/services"
	"database/sql"

	"github.com/gin-gonic/gin"
	amqp "github.com/rabbitmq/amqp091-go"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func setUpA2FGroup(router *gin.Engine) {
        totp := router.Group("/totp", middleware.AuthMiddleware(), middleware.A2FMiddleware())
        totp.GET("/generate", controllers.GenerateTOTP)
        totp.POST("/validate", controllers.ValidateTOTP)

        mail := router.Group("/mail", middleware.AuthMiddleware())
        mail.GET("/generate", controllers.GenerateMailCode)
        mail.POST("/validate", controllers.ValidateMailCode)

        router.POST("/2fa/method", middleware.AuthMiddleware(), middleware.A2FMiddleware(), controllers.SelectMethod)
}

func setUpOauthGroup(router *gin.Engine) {
	router.POST("/oauth/:service", controllers.OAuth)

	protected := router.Group("/", middleware.AuthMiddleware(), middleware.A2FMiddleware())
	protected.POST("/oauth/bind/:service", controllers.OAuthBind)
	protected.POST("/oauth/refresh/:service", controllers.OAuthRefresh)
}

func setUpAuthGroup(router *gin.Engine) {
	auth := router.Group("/auth")
	{
		auth.POST("/register", controllers.Register)
		auth.POST("/login", controllers.Login)
		auth.POST("/login/2fa", controllers.LoginA2F)
		auth.GET("/health", controllers.AuthHealth)
	}
}

func setUpWorkflowGroup(router *gin.Engine) {
	workflow := router.Group("/workflow")
	workflow.Use(middleware.AuthMiddleware(), middleware.A2FMiddleware())
	{
		workflow.POST("/create", controllers.WorkflowCreate)
		workflow.GET("/list", controllers.WorkflowList)
		workflow.DELETE("/delete/:id", controllers.WorkflowDelete)
		workflow.GET("/:id", controllers.WorkflowGet)
		workflow.PUT("/:id", controllers.WorkflowUpdate)

                workflow.GET("/trigger/:id", controllers.TriggerWorkflow)
                workflow.GET("/trigger", controllers.TriggerWorkflows)
	}
}

func setUpSecretGroup(router *gin.Engine) {
        secret := router.Group("/secret")
        secret.Use(middleware.AuthMiddleware(), middleware.A2FMiddleware())
        {
                secret.POST("/create", controllers.SecretCreate)
                secret.GET("/list", controllers.SecretList)
                secret.DELETE("/delete/:id", controllers.SecretDelete)
                //secret.PUT("/update", controllers.l
        }
}

func setUpUserGroup(router *gin.Engine) {
	user := router.Group("/user")
	user.Use(middleware.AuthMiddleware(), middleware.A2FMiddleware())
	{
		user.GET("/me", controllers.UserMe)
		user.DELETE("/delete", controllers.UserDelete)
	}
}

func InitServices(db *sql.DB, rmq *amqp.Connection) {
	services.InitHealthService(db, rmq)
}

func SetupRouter(db *sql.DB, rmq *amqp.Connection) *gin.Engine {
	InitServices(db, rmq)

	router := gin.Default()
	router.Use(middleware.ErrorHandlerMiddleware())
	if config.AppConfig.Cors {
		router.Use(middleware.EnableCors())
	}
	if config.AppConfig.Swagger {
		router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	}

	router.GET("/health", controllers.SystemHealth)
	router.GET("/trigger", controllers.Trigger)
	router.HEAD("/health", controllers.SystemHealth)

	public := router.Group("/")
	{
		public.GET("/ping", controllers.Ping)
	}
	setUpAuthGroup(router)
	setUpOauthGroup(router)
	setUpUserGroup(router)
	setUpWorkflowGroup(router)
        setUpSecretGroup(router)
        setUpA2FGroup(router)
	protected := router.Group("/")
	protected.Use(middleware.AuthMiddleware(), middleware.A2FMiddleware())
	{
		protected.GET("/about.json", controllers.About(controllers.GetServices))
	}
	return router
}
