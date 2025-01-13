package controllers

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestPing(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.Default()
	public := router.Group("/")
	{
		public.GET("/ping", Ping)
	}
	req, err := http.NewRequest(http.MethodGet, "/ping", nil)
	assert.NoError(t, err)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"message": "pong"}`, w.Body.String())
}
