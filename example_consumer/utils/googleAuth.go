package utils

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/lakhinsu/rabbitmq-go-example/consumer/utils"
	"github.com/rs/zerolog/log"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/gmail/v1"
	"google.golang.org/api/option"
	"google.golang.org/api/people/v1"
	"net/http"
	"time"
)

var (
	Token        *oauth2.Token
	refreshToken string
)

var config = &oauth2.Config{
	RedirectURL:  "http://localhost:8042/auth/google/callback",
	ClientID:     utils.GetEnvVar("CLIENT_ID"),
	ClientSecret: utils.GetEnvVar("GOOGLE_CREDENTIAL"),
	Scopes:       []string{"https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/gmail.send"},
	Endpoint:     google.Endpoint,
}

func GetAuthURL(w http.ResponseWriter, r *http.Request) {
	url := config.AuthCodeURL("state-token", oauth2.AccessTypeOffline)
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

func RefreshToken() error {
	ctx := context.Background()
	token := &oauth2.Token{RefreshToken: refreshToken}
	newToken, err := config.TokenSource(ctx, token).Token()
	if err != nil {
		return err
	}
	Token = newToken
	return nil
}

func ExchangeCodeForToken(code string) (*oauth2.Token, error) {
	ctx := context.Background()
	token, err := config.Exchange(ctx, code)
	if err != nil {
		return nil, err
	}
	Token = token
	refreshToken = token.RefreshToken
	return token, nil
}

func InitGoogleAPI(token *oauth2.Token, apiName string) (interface{}, error) {
	if Token.Expiry.Before(time.Now()) {
		if err := RefreshToken(); err != nil {
			return nil, err
		}
	}
	ctx := context.Background()
	httpClient := config.Client(ctx, token)

	switch apiName {
	case "gmail":
		service, err := gmail.NewService(ctx, option.WithHTTPClient(httpClient))
		if err != nil {
			return nil, err
		}
		return service, nil
	case "people":
		service, err := people.NewService(ctx, option.WithHTTPClient(httpClient))
		if err != nil {
			return nil, err
		}
		return service, nil
	default:
		return nil, fmt.Errorf("unsupported API: %s", apiName)
	}
}

func HandleGoogleCallback(w http.ResponseWriter, r *http.Request) {
	code := r.FormValue("code")
	_, err := ExchangeCodeForToken(code)
	if err != nil {
		http.Error(w, "Failed to exchange token", http.StatusInternalServerError)
		return
	}

	response, err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + Token.AccessToken)
	if err != nil {
		http.Error(w, "Failed to get user info", http.StatusInternalServerError)
		return
	}
	defer response.Body.Close()

	var userInfo map[string]interface{}
	err = json.NewDecoder(response.Body).Decode(&userInfo)
	if err != nil {
		http.Error(w, "Failed to decode user info", http.StatusInternalServerError)
		return
	}
	log.Log().Msgf("User info: %+v", userInfo)
}
