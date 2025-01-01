package github

import (
	"AREA/internal/models"
	"AREA/internal/oauth"
	"AREA/internal/pkg"
	"bytes"
	"encoding/json"
	"net/http"
)

type Repo struct {
        Name                    string  `json:"name"`
        Description             string  `json:"description,omitempty"`
        Public                  bool    `json:"public"`
        GitignoreTemplate       string  `json:"gitignore_template,omitempty"`
        LicenseTemplate         string  `json:"license_template,omitempty"`
}

func createUserRepoRequest(args map[string]string) []byte {
        var repo Repo
        repo.Name = args["name"]
        repo.Description = args["description"]
        if args["public"] == "true" {
                repo.Public = true
        } else {
                repo.Public = false
        }
        repo.GitignoreTemplate = args["gitignore_template"]
        repo.LicenseTemplate = args["license_template"]
        body, _ := json.Marshal(repo)
        return body
}

func CreateUserRepo(user *models.User, args map[string]string) {
        var token models.Token
        pkg.DB.Where("user_id = ? AND service_id = ?", user.ID, 2).First(&token)

        body := createUserRepoRequest(args)
        req, err := http.NewRequest("POST", "https://api.github.com/user/repos", bytes.NewBuffer(body))
        if err != nil {
                return
        }
        req.Header.Set("Authorization", "Bearer " + token.Token)
        req.Header.Set("Accept", "application/vnd.github+json")

        resp, err := oauth.SendRequest(&token, req)
        if err != nil {
                return
        }
        defer resp.Body.Close()
}
