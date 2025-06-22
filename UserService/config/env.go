package config

import (
	"os"

	"github.com/K3shavGarg/user-service/token"
)

type Config struct {
	PublicHost    string
	Port          string
	DBUser        string
	DBPassword    string
	DBAddress     string
	DBName        string
}

var (
	Env         *Config
	TokenMaker  *token.JWTMaker
)


func initConfig() (*Config, *token.JWTMaker) {
	tm := token.NewJWTMaker(getEnv("JWT_SECRET", "01234567890123456789012345678901"))
	cfg := &Config{
		PublicHost:    getEnv("PUBLIC_HOST", "localhost"),
		Port:          getEnv("PORT", "8080"),
		DBUser:        getEnv("DB_USER", "root"),
		DBPassword:    getEnv("DB_PASSWORD", "password"),
		DBAddress:     getEnv("DB_ADDRESS", "localhost:3306"),
		DBName:        getEnv("DB_NAME", "ecom"),
	}
	return cfg, tm
}


func init() { // Init is called automatically when the package is imported
	Env, TokenMaker = initConfig()
}


func getEnv(key, fallback string) string {
	// A fallback is used if the environment variable is not set
	if val, ok := os.LookupEnv(key); ok {
		return val
	}
	return fallback
}
