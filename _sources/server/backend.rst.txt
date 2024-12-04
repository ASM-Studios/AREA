Backend Structure
=================

Overview
--------

The backend is structured to follow the principles of separation of concerns. Each layer is responsible for a specific task, making the code more modular and easier to maintain.

Router
------------

The router is set up using the `gin-gonic` framework. It includes routes for public and protected endpoints. Middleware (such as authentication) is applied at this level.

Example:

.. code-block:: go

    package routes

    import (
        "controllers"
        "github.com/gin-gonic/gin"
    )

    func SetupRouter() *gin.Engine {
        router := gin.Default()

        // Public routes
        public := router.Group("/api")
        {
            public.POST("/login", controllers.Login)
            public.POST("/register", controllers.Register)
        }

        // Protected routes (requires authentication)
        protected := router.Group("/api")
        protected.Use(AuthMiddleware())
        {
            protected.GET("/profile", controllers.GetProfile)
            protected.POST("/update-profile", controllers.UpdateProfile)
        }

        return router
    }

Route Groups
^^^^^^^^^^^^

The `gin-gonic` framework allows organizing routes into groups. This improves readability and makes it easier to apply middleware to specific groups of routes.

1. **Public Routes**: Do not require authentication. These routes are accessible to all users.
2. **Protected Routes**: Require the user to be authenticated. Middleware is used to enforce this requirement.

Middleware in the Router
^^^^^^^^^^^^^^^^^^^^^^^^

Middleware can be applied to route groups or individual routes. For example:

.. code-block:: go

    protected.Use(AuthMiddleware())

This ensures that all routes under the `protected` group require a valid token for access.

Router Initialization
^^^^^^^^^^^^^^^^^^^^^

The router is initialized and run in the `main.go` file:

.. code-block:: go

    package main

    import (
        "routes"
    )

    func main() {
        router := routes.SetupRouter()
        router.Run(":8080") // Start the server on port 8080
    }



Controllers
-----------

Controllers handle incoming HTTP requests and return appropriate responses. They typically:

- Parse request data (e.g., JSON payloads).
- Call services or business logic layers to perform operations.
- Return HTTP responses to the client.

Example:

.. code-block:: go

    func Login(c *gin.Context) {
        email := c.PostForm("email")
        password := c.PostForm("password")
        token, err := authService.Login(email, password)
        if err != nil {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
            return
        }
        c.JSON(http.StatusOK, gin.H{"token": token})
    }


Middleware
----------

Middleware is used to handle cross-cutting concerns like authentication, logging, or error handling. Middleware functions are executed before or after controllers handle requests.

Example Authentication Middleware:

.. code-block:: go

    func AuthMiddleware() gin.HandlerFunc {
        return func(c *gin.Context) {
            token := c.GetHeader("Authorization")
            if token == "" || !authService.IsValidToken(token) {
                c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
                return
            }
            c.Next()
        }
    }


Models
------

Models represent the structure of data stored in the MariaDB database. They define the schema for each table and map the database structure to Go objects. Models are managed using the `gorm` library.

Example User Model:

.. code-block:: go

    package models

    import "gorm.io/gorm"

    type User struct {
        ID       uint   `gorm:"primaryKey"`
        Email    string `gorm:"unique;not null"`
        Password string `gorm:"not null"`
        Token    string
    }

    func Migrate(db *gorm.DB) {
        db.AutoMigrate(&User{})
    }

Explanation:

- **ID**: The primary key for the `users` table.
- **Email**: A unique and non-nullable field for storing user emails.
- **Password**: A non-nullable field for storing hashed passwords.
- **Token**: Used for authentication and session management.

To migrate models to the database, run the migration function during initialization:

.. code-block:: go

    import (
        "gorm.io/driver/mysql"
        "gorm.io/gorm"
        "models"
    )

    func InitDB() *gorm.DB {
        dsn := "user:password@tcp(127.0.0.1:3306)/dbname?charset=utf8mb4&parseTime=True&loc=Local"
        db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
        if err != nil {
            panic("Failed to connect to the database!")
        }
        models.Migrate(db)
        return db
    }
