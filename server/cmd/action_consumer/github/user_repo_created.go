package github

import (
	"AREA/internal/gconsts"
	"AREA/internal/models"
	"AREA/internal/oauth"
	"AREA/internal/pkg"
	"AREA/internal/utils"
	"errors"
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

func detectUserRepo(workflow *models.Workflow, repos []Repo) (bool, []interface{}, error) {
        callReaction := false
        var interfaces []interface{}

        for _, repo := range repos {
                timestamp, _ := time.Parse(time.RFC3339, repo.CreatedAt)
                if timestamp.Unix() > workflow.LastTrigger {
                        callReaction = true
                        interfaces = append(interfaces, repo)
                }
        }
        return callReaction, interfaces, nil
}

func UserRepoCreated(workflow *models.Workflow, user *models.User, args map[string]string) (bool, []interface{}, error) {
        var token models.Token
        pkg.DB.Where("user_id = ? AND service_id = ?", user.ID, gconsts.ServiceMap["github"]).First(&token)

        req, err := http.NewRequest("GET", fmt.Sprintf("https://api.github.com/users/%s/repos", args["user"]), nil)
        if err != nil {
                return false, nil, errors.New("Failed to create request")
        }
        req.Header.Set("Authorization", "Bearer " + token.Token)
        req.Header.Set("Accept", "application/vnd.github+json")

        resp, err := oauth.SendRequest(&token, req)
        if err != nil {
                return false, nil, errors.New("Failed to send request")
        }
        defer resp.Body.Close()
        if resp.StatusCode != 200 {
                return false, nil, errors.New("Failed to fetch repos")
        }

        result, err := utils.ExtractBody[[]Repo](resp)
        return detectUserRepo(workflow, *result)
}
