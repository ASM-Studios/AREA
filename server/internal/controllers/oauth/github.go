package oauth

import (
	"encoding/json"
	"io"
	"net/http"
)

type GithubResponse struct {
        Mail string `json:"email"`
        DisplayName string `json:"login"`
}

func GetGithubResponse(serviceRawResponse *http.Response) (*ServiceResponse, error) {
        var githubResponse GithubResponse

        body, err := io.ReadAll(serviceRawResponse.Body)
        if err != nil {
                return nil, err
        }
        err = json.Unmarshal([]byte(body), &githubResponse)
        if err != nil {
                return nil, err
        }

        serviceResponse := ServiceResponse(githubResponse)
        return &serviceResponse, nil
}
