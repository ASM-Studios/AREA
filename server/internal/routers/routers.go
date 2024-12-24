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

func setUpOauthGroup(router *gin.Engine) {
        router.POST("/oauth/:service", controllers.OAuth)
        protected := router.Group("/", middleware.AuthMiddleware())
        protected.POST("/oauth/bind/:service", controllers.OAuthBind)
        protected.POST("/oauth/refresh/:service", controllers.OAuthRefresh)
}

func setUpAuthGroup(router *gin.Engine) {
	auth := router.Group("/auth")
	{
		auth.POST("/register", controllers.Register)
		auth.POST("/login", controllers.Login)
		auth.GET("/health", controllers.AuthHealth)
	}
}

func setUpWorkflowGroup(router *gin.Engine) {
	workflow := router.Group("/workflow")
	workflow.Use(middleware.AuthMiddleware())
	{
		workflow.POST("/create", controllers.WorkflowCreate)
		workflow.GET("/list", controllers.WorkflowList)
		workflow.DELETE("/delete/:id", controllers.WorkflowDelete)
		workflow.GET("/:id", controllers.WorkflowGet)
		workflow.PUT("/:id", controllers.WorkflowUpdate)
	}
}

func setUpUserGroup(router *gin.Engine) {
	user := router.Group("/user")
	user.Use(middleware.AuthMiddleware())
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
	router.HEAD("/health", controllers.SystemHealth)

	public := router.Group("/")
	{
		public.GET("/ping", controllers.Ping)
		public.POST("/publish/message", controllers.Message)
	}
	setUpAuthGroup(router)
	setUpOauthGroup(router)
	setUpUserGroup(router)
	setUpWorkflowGroup(router)
	protected := router.Group("/")
	protected.Use(middleware.AuthMiddleware())
	{
		protected.GET("/about.json", controllers.About)
		//protected.GET("/user", controllers.GetUser)
	}
	return router
}
