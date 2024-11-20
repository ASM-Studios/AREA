package models

// User struct (representing MongoDB document)
type User struct {
	ID       string `json:"id" bson:"_id"`
	Email    string `json:"email" bson:"email"`
	Password string `json:"password" bson:"password"`
}
