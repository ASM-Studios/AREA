package routers

import (
	"AREA/internal/config"
	"AREA/internal/controllers"
	"AREA/internal/middleware"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

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
		public.POST("/register", controllers.Register)
		public.POST("/login", controllers.Login)
		public.GET("/about.json", controllers.About)
		public.GET("/ping", controllers.Ping)
	}
	protected := router.Group("/")
	protected.Use(middleware.AuthMiddleware())
	{
		//protected.GET("/users", controllers.GetUsers)
	}
	return router
}
