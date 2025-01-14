package controllers

import (
	"AREA/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/goccy/go-json"
	"github.com/stretchr/testify/assert"
	"net/http"
	"net/http/httptest"
	"os"
	"strconv"
	"testing"
	"time"
)

func mockGetServices(_ models.User) []models.ServiceList {
	return []models.ServiceList{
		{
			Id:   1,
			Name: "Test Service",
			Actions: []models.Action{
				{
					Id:          1,
					Name:        "Test Action",
					Description: "A test action",
				},
			},
			Reaction: []models.Reaction{
				{
					Id:          2,
					Name:        "Test Reaction",
					Description: "A test reaction",
				},
			},
		},
	}
}

func MockAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("user", "mockUser")
		c.Next()
	}
}

func TestAbout(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.Use(MockAuthMiddleware())
	router.GET("/about.json", About(mockGetServices))
	req, err := http.NewRequest(http.MethodGet, "/about.json", nil)
	req.RemoteAddr = "127.0.0.1:12345"
	assert.NoError(t, err)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	expectedJSON, err := os.ReadFile("testdata/about.json")
	assert.NoError(t, err)

	var expected map[string]interface{}
	err = json.Unmarshal(expectedJSON, &expected)
	assert.NoError(t, err)

	expected["client"].(map[string]interface{})["host"] = "127.0.0.1"
	expected["server"].(map[string]interface{})["current_time"] = strconv.FormatInt(time.Now().Unix(), 10)

	var actual map[string]interface{}
	err = json.Unmarshal(w.Body.Bytes(), &actual)
	assert.NoError(t, err)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, expected, actual)
}
