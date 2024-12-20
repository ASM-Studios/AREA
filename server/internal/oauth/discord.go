package oauth

import (
	"encoding/json"
	"io"
	"net/http"
)

type DiscordResponse struct {
        Mail string `json:"email"`
        DisplayName string `json:"username"`
}

func GetDiscordResponse(serviceRawResponse *http.Response) (*ServiceResponse, error) {
        var discordResponse DiscordResponse

        body, err := io.ReadAll(serviceRawResponse.Body)
        if err != nil {
                return nil, err
        }
        err = json.Unmarshal([]byte(body), &discordResponse)
        if err != nil {
                return nil, err
        }

        serviceResponse := ServiceResponse(discordResponse)
        return &serviceResponse, nil
}
