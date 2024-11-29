package config

import (
	"github.com/gookit/config/v2"
	"github.com/gookit/config/v2/json"
	"log"
)

var AppConfig *Config

type DB struct {
	Host     string `mapstructure:"host"`
	Port     int    `mapstructure:"port"`
	Name     string `mapstructure:"name"`
	User     string `mapstructure:"user"`
	Password string `mapstructure:"password"`
}

type Config struct {
	AppName     string   `mapstructure:"app_name"`
	Port        int      `mapstructure:"port"`
	GinMode     string   `mapstructure:"gin_mode"`
	Cors        bool     `mapstructure:"cors"`
	CorsOrigins []string `mapstructure:"cors_origins"`
	SecretKey   string   `mapstructure:"secret_key"`
	Swagger     bool     `mapstructure:"swagger"`
	DB          DB       `mapstructure:"db"`
}

func LoadConfig() {

	config.WithOptions(config.ParseEnv)
	config.AddDriver(json.Driver)

	if err := config.LoadFiles("config.json"); err != nil {
		log.Fatalf("Error loading config file: %v", err)
	}

	AppConfig = &Config{}
	if err := config.BindStruct("", AppConfig); err != nil {
		log.Fatalf("Error binding config to struct: %v", err)
	}
}
