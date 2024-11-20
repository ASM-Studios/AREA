package controllers

import (
	"AREA/internal/models"
	"AREA/pkg/db"
	"context"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func GetAllUsers() ([]models.User, error) {
	cursor, err := db.Collection.Find(context.Background(), bson.D{})
	if err != nil {
		return nil, err
	}
	defer func(cursor *mongo.Cursor, ctx context.Context) {
		err := cursor.Close(ctx)
		if err != nil {

		}
	}(cursor, context.Background())

	var users []models.User
	for cursor.Next(context.Background()) {
		var user models.User
		if err := cursor.Decode(&user); err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return users, nil
}

// GetUsers godoc
// @Summary GetUsers
// @Description GetUsers
// @Tags about
// @Accept  json
// @Produce  json
// @Success 200 {Object} []models.User
// @Router /users [get]
func GetUsers(c *gin.Context) {
	users, err := GetAllUsers()
	if err != nil {
		return
	}
	c.JSON(200, users)
}
