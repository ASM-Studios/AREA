package main

import (
    _ "io"
    "AREA/pkg/db"
    "errors"
    "net/http"
    "gorm.io/gorm"
    "github.com/gin-gonic/gin"
)

type User struct {
    gorm.Model
    Name string `gorm:"not null" json:"name" binding:"required"`
    Age int `gorm:"not null" json:"age" binding:"required"`
}

func setupRoute(serv *gin.Engine, db *gorm.DB) {
    serv.GET("/ping", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{
            "message": "pong",
        })
    })

    serv.GET("/user", func(c *gin.Context) {
        var users []User
        db.Find(&users)
        c.JSON(http.StatusOK, gin.H{
            "users": users,
        })
    })

    serv.GET("/user/:id", func(c *gin.Context) {
        var user User
        result := db.Where("id = ?", c.Param("id")).First(&user)
        if (errors.Is(result.Error, gorm.ErrRecordNotFound)) {
            c.AbortWithError(http.StatusNotFound, result.Error)
            return
        }
        c.JSON(http.StatusOK, gin.H {
            "user": user,
        })
    })

    serv.POST("/user", func(c *gin.Context) {
        user := User{}
        if err := c.ShouldBindJSON(&user); err != nil {
            c.AbortWithStatus(http.StatusBadRequest)
            return
        }
        db.Create(&user)
        c.Status(http.StatusOK)
    })

    serv.DELETE("/user/:id", func(c *gin.Context) {
        var user User
        result := db.Where("id = ?", c.Param("id")).First(&user)
        if (errors.Is(result.Error, gorm.ErrRecordNotFound)) {
            c.AbortWithError(http.StatusBadRequest, result.Error)
            return
        }
        db.Delete(&user)
        c.Status(http.StatusOK)
    })
}

func main() {
    db := db.InitDB()
    db.AutoMigrate(&User{})

    server := gin.Default()
    setupRoute(server, db)
    
    server.Run(":8000")
}
