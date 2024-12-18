package utils

import (
	"AREA/internal/consts"
	"encoding/json"
	"io"
	"net/http"

	"github.com/rs/zerolog/log"
	"github.com/spf13/viper"
)

func init() {
	viper.SetConfigFile(consts.EnvFile)
	viper.AddConfigPath(consts.EnvFileDirectory)
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

func SendRequest[T any](request *http.Request) (*http.Response, *T, error) {
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
