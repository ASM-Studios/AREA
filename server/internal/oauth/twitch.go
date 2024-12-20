package oauth

import (
	"encoding/json"
	"io"
	"net/http"
)

type TwitchResponse struct {
        Data []struct {
                Mail            string  `json:"email"`
                DisplayName     string  `json:"display_name"`
        }
}

func GetTwitchResponse(serviceRawResponse *http.Response) (*ServiceResponse, error) {
        var twitchResponse TwitchResponse

        body, err := io.ReadAll(serviceRawResponse.Body)
        if err != nil {
                return nil, err
        }
        err = json.Unmarshal([]byte(body), &twitchResponse)
        if err != nil {
                return nil, err
        }

        serviceResponse := ServiceResponse{
                Mail: twitchResponse.Data[0].Mail,
                DisplayName: twitchResponse.Data[0].DisplayName,
        }
        return &serviceResponse, nil
}
