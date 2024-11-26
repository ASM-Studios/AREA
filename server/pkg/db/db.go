package db

import (
    "gorm.io/gorm"
    "gorm.io/driver/mysql"
)

func InitDB() *gorm.DB {
    dsn := "root:root@tcp(172.17.0.1:3305)/area?parseTime=true"
    db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
    if (err != nil) {
        panic("failed to connect to database")
    }
    return db
}
