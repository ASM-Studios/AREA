package oauth

import (
	"encoding/json"
	"io"
	"net/http"
)

type MicrosoftResponse struct {
        Mail string `json:"mail"`
        DisplayName string `json:"displayName"`
}

func GetMicrosoftResponse(serviceRawResponse *http.Response, token string) (*ServiceResponse, error) {
        var microsoftResponse MicrosoftResponse

        body, err := io.ReadAll(serviceRawResponse.Body)
        if err != nil {
                return nil, err
        }
        err = json.Unmarshal([]byte(body), &microsoftResponse)
        if err != nil {
                return nil, err
        }

        serviceResponse := ServiceResponse(microsoftResponse)
        return &serviceResponse, nil
}
