package config

import (
    "AREA/tests/mocks"
    "github.com/stretchr/testify/assert"
    "log"
    "os"
    "testing"
)

func setupMockConfigFile(content string) (string, error) {
    tempFile, err := os.CreateTemp("../../tests/data", "test_config*.json")
    if err != nil {
        return "", err
    }
    if _, err := tempFile.WriteString(content); err != nil {
        tempFile.Close()
        return "", err
    }
    tempFile.Close()
    return tempFile.Name(), nil
}

func TestLoadConfig_Success(t *testing.T) {
    mockContent :=
    `{
            "app_name": "TestApp",
            "port": 9000,
            "gin_mode": "release",
            "cors": true,
            "cors_origins": ["http://example.com"],
            "swagger": true
	}`
    configFile, err := setupMockConfigFile(mockContent)
    if err != nil {
        t.Fatalf("Failed to create mock config file: %v", err)
    }
    defer os.Remove(configFile)
    os.Setenv("CONFIG_PATH", configFile)
    LoadConfig()
    expected := &Config{
        AppName:     "TestApp",
        Port:        9000,
        GinMode:     "release",
        Cors:        true,
        CorsOrigins: []string{"http://example.com"},
        Swagger:     true,
    }
    
    assert.Equal(t, expected, AppConfig)
}

func TestLoadConfig_FileNotFound(t *testing.T) {
    var logOutput string
    log.SetOutput(&mocks.MockWriter{Output: &logOutput})
    defer log.SetOutput(os.Stderr)
    os.Setenv("CONFIG_PATH", "non_existent_config.json")
    expectedMessage := "open non_existent_config.json: no such file or directory"
    LoadConfig()
    assert.Contains(t, logOutput, expectedMessage)
}

func TestLoadConfig_InvalidStructure(t *testing.T) {
    mockContent := `{
		"app_name": "TestApp",
		"port": "invalid_port"
	}`
    configFile, err := setupMockConfigFile(mockContent)
    if err != nil {
        t.Fatalf("Failed to create mock config file: %v", err)
    }
    defer os.Remove(configFile)
    var logOutput string
    log.SetOutput(&mocks.MockWriter{Output: &logOutput})
    defer log.SetOutput(os.Stderr)
    os.Setenv("CONFIG_PATH", configFile)
    LoadConfig()
    assert.Contains(t, logOutput, "error(s) decoding:")
}
