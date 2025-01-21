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
	"slices"
	"time"
)

type PullRequest struct {
        URL             string  `json:"url"`
        Title           string  `json:"title"`
        CreatedAt       string  `json:"created_at"`
}

func DetectPR(workflow *models.Workflow, pr []PullRequest) (bool, []interface{}, error) {
        callReaction := false
        var interfaces []interface{}

        for _, pr := range slices.Backward(pr) {
                timestamp, _ := time.Parse(time.RFC3339, pr.CreatedAt)
                if timestamp.Unix() > workflow.LastTrigger {
                        callReaction = true
                        interfaces = append(interfaces, pr)
                }
        }
        return callReaction, interfaces, nil
}

func PRCreated(workflow *models.Workflow, user *models.User, args map[string]string) (bool, []interface{}, error) {
        var token models.Token
        pkg.DB.Where("user_id = ? AND service_id = ?", user.ID, gconsts.ServiceMap["github"]).First(&token)

        req, err := http.NewRequest("GET", fmt.Sprintf("https://api.github.com/repos/%s/%s/pulls", args["owner"], args["repo"]), nil)
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
                return false, nil, errors.New("Failed to fetch PRs")
        }

        result, err := utils.ExtractBody[[]PullRequest](resp)
        return DetectPR(workflow, *result)
}
