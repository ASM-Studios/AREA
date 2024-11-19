package routers

import (
	"github.com/ASM-Studios/AREA/internal/controllers"
	"github.com/ASM-Studios/AREA/internal/middleware"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	router := gin.Default()
	router.Use(middleware.ErrorHandlerMiddleware())
	public := router.Group("/")
	{
		/*public.POST("/register", controllers.Register)
		public.POST("/login", controllers.Login)*/
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
