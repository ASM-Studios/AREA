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

type PullRequest struct {
        URL             string  `json:"url"`
        Title           string  `json:"title"`
        CreatedAt       string  `json:"created_at"`
}


func DetectPR(workflow *models.Workflow, pr []PullRequest) bool {
        for _, pr := range pr {
                timestamp, _ := time.Parse(time.RFC3339, pr.CreatedAt)
                if timestamp.Unix() > workflow.LastTrigger {
                        return true
                }
        }
        return false
}

func PRCreated(workflow *models.Workflow, user *models.User, args map[string]string) bool {
        var token models.Token
        pkg.DB.Where("user_id = ? AND service_id = ?", user.ID, 2).First(&token)

        req, err := http.NewRequest("GET", fmt.Sprintf("https://api.github.com/repos/%s/%s/pulls", args["owner"], args["repo"]), nil)
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

        result, err := utils.ExtractBody[[]PullRequest](resp)
        return DetectPR(workflow, *result)
}
