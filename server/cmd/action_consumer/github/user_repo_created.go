package github

import (
	"AREA/internal/models"
	"AREA/internal/oauth"
	"AREA/internal/pkg"
	"AREA/internal/utils"
	"fmt"
	"net/http"
	"time"
)

type Repo struct {
        Name            string  `json:"name"`
        FullName        string  `json:"full_name"`
        URL             string  `json:"html_url"`
        CreatedAt       string  `json:"created_at"`
}

func DetectUserRepo(workflow *models.Workflow, repos []Repo) bool {
        for _, repo := range repos {
                timestamp, _ := time.Parse(time.RFC3339, repo.CreatedAt)
                if timestamp.Unix() > workflow.LastTrigger {
                        return true
                }
        }
        return false
}

func UserRepoCreated(workflow *models.Workflow, user *models.User, args map[string]string) bool {
        var token models.Token
        pkg.DB.Where("user_id = ? AND service_id = ?", user.ID, 2).First(&token)

        req, err := http.NewRequest("GET", fmt.Sprintf("https://api.github.com/users/%s/repos", args["user"]), nil)
        if err != nil {
                return false
        }
        req.Header.Set("Authorization", "Bearer " + token.Token)
        req.Header.Set("Accept", "application/vnd.github+json")

        resp, err := oauth.SendRequest(&token, req)
        if err != nil {
                return false
        }
        defer resp.Body.Close()
        if resp.StatusCode != 200 {
                return false
        }

        result, err := utils.ExtractBody[[]Repo](resp)
        return DetectUserRepo(workflow, *result)
}
