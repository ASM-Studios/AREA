package utils

import (
	"AREA/internal/gconsts"
	"encoding/json"
	"io"
	"net/http"

	"github.com/rs/zerolog/log"
	"github.com/spf13/viper"
)

func init() {
	viper.SetConfigFile(gconsts.EnvFile)
	viper.AddConfigPath(gconsts.EnvFileDirectory)
	err := viper.ReadInConfig()
	if err != nil {
		log.Debug().Err(err).
			Msg("Error occurred while reading env file, might fallback to OS env config")
	}
	viper.AutomaticEnv()
}

func GetEnvVar(name string) string {
	if !viper.IsSet(name) {
		log.Debug().Msgf("Environment variable %s is not set", name)
		return ""
	}
	value := viper.GetString(name)
	return value
}

func SendRequest(request *http.Request) (*http.Response, error) {
        resp, err := http.DefaultClient.Do(request)

        if err != nil {
                return nil, err
        }
        return resp, nil
}

func ExtractBody[T any](response *http.Response) (*T, error) {
        b, err := io.ReadAll(response.Body)
        if err != nil {
                return nil, err
        }
        var body T
        err = json.Unmarshal([]byte(b), &body)
        if err != nil {
                return nil, err
        }
        return &body, err
}

// Deprecated: Use oauth.SendRequest and utils.ExtractBody instead
func SendRequestBody[T any](request *http.Request) (*http.Response, *T, error) {
        var client http.Client
        var body T

        resp, err := client.Do(request)
        if err != nil {
                return nil, nil, err
        }

        b, err := io.ReadAll(resp.Body)
        if err != nil {
                return nil, nil, err
        }

        defer resp.Body.Close()
        err = json.Unmarshal([]byte(b), &body)
        return resp, &body, err
}
