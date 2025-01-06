package oauth

import (
	"AREA/internal/utils"
	"encoding/json"
	"errors"
	"io"
	"net/http"
)

type GithubResponse struct {
        Mail string `json:"email"`
        DisplayName string `json:"login"`
}

type GithubResponseMail struct {
        Mail string `json:"email"`
        Primary bool `json:"primary"`
        Verified bool `json:"verified"`
}

func getEmail(token string) string {
        req, err := http.NewRequest("GET", "https://api.github.com/user/emails", nil)
        if err != nil {
                return ""
        }
        req.Header.Set("Authorization", "Bearer " + token)
        req.Header.Set("Accept", "application/vnd.github+json")

        resp, err := utils.SendRequest(req)
        if err != nil {
                return ""
        }
        defer resp.Body.Close()
        if resp.StatusCode != 200 {
                return ""
        }
        result, err := utils.ExtractBody[[]GithubResponseMail](resp) 
        for _, mail := range *result {
                if mail.Primary {
                        return mail.Mail
                }
        }
        return ""
}

func GetGithubResponse(serviceRawResponse *http.Response, token string) (*ServiceResponse, error) {
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
        serviceResponse.Mail = getEmail(token)
        if serviceResponse.Mail == "" {
                return nil, errors.New("No email found")
        }
        return &serviceResponse, nil
}
