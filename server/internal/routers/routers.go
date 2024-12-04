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
	oauth := router.Group("/oauth")
	{

		oauth.POST("/google", controllers.Google)
		/*oauth.POST("/spotify", controllers.Spotify)
		oauth.POST("/github", controllers.Github)
		oauth.POST("/linkedin", controllers.Linkedin)
		oauth.POST("/discord", controllers.Discord)
		auth.POST("/twitch", controllers.Twitch)*/
	}
}

func setUpAuthGroup(router *gin.Engine) {
	auth := router.Group("/auth")
	{
		auth.POST("/register", controllers.Register)
		auth.POST("/login", controllers.Login)
		auth.GET("/health", controllers.Health)
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
	protected := router.Group("/")
	protected.Use(middleware.AuthMiddleware())
	{
		protected.GET("/about.json", controllers.About)
		//protected.GET("/user", controllers.GetUser)
	}
	return router
}
