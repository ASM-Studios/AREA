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

type Commit struct {
        Commit  struct {
                Author  struct {
                        Name    string  `json:"name"`
                        Email   string  `json:"email"`
                        Date    string  `json:"date"`
                }       `json:"author"`
                Message string  `json:"message"`
        }       `json:"commit"`
}

type CommitReturn struct {
        CommitAuthorName        string  `json:"author_name"`
        CommitAuthorEmail       string  `json:"author_email"`
        CommitAuthorDate        string  `json:"author_date"`
        CommitMessage           string  `json:"message"`
}

func DetectCommit(workflow *models.Workflow, commits []Commit) (bool, []interface{}, error) {
        callReaction := false
        var interfaces []interface{}

        for _, commit := range slices.Backward(commits) {
                timestamp, _ := time.Parse(time.RFC3339, commit.Commit.Author.Date)
                if timestamp.Unix() > workflow.LastTrigger {
                        callReaction = true
                        interfaces = append(interfaces, CommitReturn {
                                CommitAuthorName: commit.Commit.Author.Name,
                                CommitAuthorEmail: commit.Commit.Author.Email,
                                CommitAuthorDate: commit.Commit.Author.Date,
                                CommitMessage: commit.Commit.Message,
                        })
                }
        }
        return callReaction, interfaces, nil
}

func CommitCreated(workflow *models.Workflow, user *models.User, args map[string]string) (bool, []interface{}, error) {
        var token models.Token
        pkg.DB.Where("user_id = ? AND service_id = ?", user.ID, gconsts.ServiceMap["github"]).First(&token)

        req, err := http.NewRequest("GET", fmt.Sprintf("https://api.github.com/repos/%s/%s/commits", args["owner"], args["repo"]), nil)
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

        result, err := utils.ExtractBody[[]Commit](resp)
        return DetectCommit(workflow, *result)
}
