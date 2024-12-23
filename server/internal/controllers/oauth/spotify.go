package oauth

import (
	"encoding/json"
	"io"
	"net/http"
)

type SpotifyResponse struct {
        Mail string `json:"email"`
        DisplayName string `json:"display_name"`
}

func GetSpotifyResponse(serviceRawResponse *http.Response) (*ServiceResponse, error) {
        var spotifyResponse SpotifyResponse

        body, err := io.ReadAll(serviceRawResponse.Body)
        if err != nil {
                return nil, err
        }
        err = json.Unmarshal([]byte(body), &spotifyResponse)
        if err != nil {
                return nil, err
        }

        serviceResponse := ServiceResponse(spotifyResponse)
        return &serviceResponse, nil
}
