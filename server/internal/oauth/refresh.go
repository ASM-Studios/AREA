package oauth

import (
	"AREA/internal/models"
	"net/http"
)

func FetchNewToken(user *models.User, dbToken *models.Token) (error) {
        _, err := http.NewRequest("POST", "bs", nil)
        if err != nil {
                return err
        }
        return nil
}
