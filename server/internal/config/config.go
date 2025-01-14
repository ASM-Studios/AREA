package config

import (
	"github.com/gookit/config/v2"
	"github.com/gookit/config/v2/json"
	"log"
	"os"
)

var AppConfig *Config

type Config struct {
	AppName         string          `mapstructure:"app_name"`
	Port            int             `mapstructure:"port"`
	GinMode         string          `mapstructure:"gin_mode"`
        TriggerInterval int             `mapstructure:"trigger_interval"`
	Cors            bool            `mapstructure:"cors"`
	CorsOrigins     []string        `mapstructure:"cors_origins"`
	Swagger         bool            `mapstructure:"swagger"`
}

func LoadConfig() {
	cfg := config.New("default")
	configPath := os.Getenv("CONFIG_PATH")
	if configPath == "" {
		configPath = "config.json"
	}
	cfg.WithOptions(config.ParseEnv)
	cfg.AddDriver(json.Driver)

	if err := cfg.LoadFiles(configPath); err != nil {
		log.Print(err)
		return
	}

	AppConfig = &Config{}
	if err := cfg.BindStruct("", AppConfig); err != nil {
		log.Print(err)
		return
	}
}
