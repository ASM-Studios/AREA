package oauth

import (
	"AREA/internal/models"
	"AREA/internal/pkg"
	"AREA/internal/utils"
	"errors"
	"fmt"
	"io"
	"net/http"
)

func SendRequest(token *models.Token, req *http.Request) (*http.Response, error) {
        resp, err := utils.SendRequest(req)
        if err != nil {
                return resp, err
        }

        b, err := io.ReadAll(resp.Body)
        if resp.StatusCode == 401 {
                fmt.Println(string(b))
                fmt.Println("Token expired, trying to refresh")
                err = FetchNewToken(token)
                if err != nil {
                        fmt.Println("Failed to refresh token")
                        token.Expired = true
                        return nil, errors.New("Token expired")
                }
                fmt.Println("Token refreshed")
                pkg.DB.Save(token)
                resp, err = utils.SendRequest(req)
        }
        return resp, err
}
