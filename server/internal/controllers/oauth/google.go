package oauth

import (
	"encoding/json"
	"io"
	"net/http"
)

type GoogleResponse struct {
        Mail string `json:"email"`
        DisplayName string `json:"username"`
}

func GetGoogleResponse(serviceRawResponse *http.Response) (*ServiceResponse, error) {
        var googleResponse GoogleResponse

        body, err := io.ReadAll(serviceRawResponse.Body)
        if err != nil {
                return nil, err
        }
        err = json.Unmarshal([]byte(body), &googleResponse)
        if err != nil {
                return nil, err
        }

        serviceResponse := ServiceResponse(googleResponse)
        return &serviceResponse, nil
}