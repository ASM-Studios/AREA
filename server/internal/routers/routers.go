package routers

import (
	_ "AREA/docs"
	"AREA/internal/config"
	"AREA/internal/controllers"
	"AREA/internal/middleware"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func setUpOauthGroup(router *gin.Engine) {
	router.POST("/oauth/:service", controllers.OAuth)
	//router.POST("/oauth/bind/:service", controllers.OAuthBind)
}

func setUpAuthGroup(router *gin.Engine) {
	auth := router.Group("/auth")
	{
		auth.POST("/register", controllers.Register)
		auth.POST("/login", controllers.Login)
		auth.GET("/health", controllers.Health)
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

func SetupRouter() *gin.Engine {
	router := gin.Default()
	router.Use(middleware.ErrorHandlerMiddleware())
	if config.AppConfig.Cors {
		router.Use(middleware.EnableCors())
	}
	if config.AppConfig.Swagger {
		router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	}
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
