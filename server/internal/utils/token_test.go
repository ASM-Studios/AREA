package utils

import (
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/stretchr/testify/assert"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

func mockGetEnvVar(key string) string {
	if key == "SECRET_KEY" {
		return "super-secret-key"
	}
	return ""
}

func TestNewToken(t *testing.T) {
	originalGetEnvVar := GetEnvVar
	GetEnvVar = mockGetEnvVar
	defer func() { GetEnvVar = originalGetEnvVar }()

	gin.SetMode(gin.TestMode)
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	email := "test@example.com"

	tokenString := NewToken(c, email)
	assert.NotEmpty(t, tokenString, "expected a non-empty token string")
	assert.Equal(t, http.StatusOK, w.Code, "Expected 200 OK for a successful token generation")
}

func TestVerifyToken(t *testing.T) {
	originalGetEnvVar := GetEnvVar
	GetEnvVar = mockGetEnvVar
	defer func() { GetEnvVar = originalGetEnvVar }()

	gin.SetMode(gin.TestMode)

	t.Run("Success - valid token with Bearer prefix", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		// Generate a valid token
		email := "testuser@example.com"
		token := generateValidTestToken(email, mockGetEnvVar("SECRET_KEY"))
		authHeader := "Bearer " + token

		c.Request = httptest.NewRequest("GET", "/", nil)
		c.Request.Header.Set("Authorization", authHeader)

		gotEmail, err := VerifyToken(c)
		assert.NoError(t, err, "expected no error from VerifyToken with valid token")
		assert.Equal(t, email, gotEmail, "expected the returned email to match the token's email claim")
	})

	t.Run("Fail - missing Bearer prefix", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		// Provide a token without "Bearer "
		c.Request = httptest.NewRequest("GET", "/", nil)
		c.Request.Header.Set("Authorization", "INVALID "+generateValidTestToken("foo@example.com", mockGetEnvVar("SECRET_KEY")))

		_, err := VerifyToken(c)
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "Bearer token is missing")
	})

	t.Run("Fail - empty token", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		c.Request = httptest.NewRequest("GET", "/", nil)
		// Proper prefix, but no token after it
		c.Request.Header.Set("Authorization", "Bearer ")

		_, err := VerifyToken(c)
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "Authorization token is missing")
	})

	t.Run("Fail - token expired", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		// Generate an already-expired token
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"email": "expired@example.com",
			"exp":   time.Now().Add(-time.Hour).Unix(),
		})
		tokenString, _ := token.SignedString([]byte(mockGetEnvVar("SECRET_KEY")))

		c.Request = httptest.NewRequest("GET", "/", nil)
		c.Request.Header.Set("Authorization", "Bearer "+tokenString)

		_, err := VerifyToken(c)
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "token is expired")
	})

	t.Run("Fail - invalid token signature", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"email": "wrongSecret@example.com",
			"exp":   time.Now().Add(time.Hour).Unix(),
		})
		tokenString, _ := token.SignedString([]byte("a-different-secret"))

		c.Request = httptest.NewRequest("GET", "/", nil)
		c.Request.Header.Set("Authorization", "Bearer "+tokenString)

		_, err := VerifyToken(c)
		assert.Error(t, err)
		assert.NotContains(t, err.Error(), "Token is expired", "Should not incorrectly say token expired")
		assert.Contains(t, err.Error(), "signature is invalid", "Likely error message for mismatched secret")
	})
}

func generateValidTestToken(email, secretKey string) string {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email": email,
		"exp":   time.Now().Add(time.Hour).Unix(),
	})

	tokenString, err := token.SignedString([]byte(secretKey))
	if err != nil {
		panic(err)
	}
	return tokenString
}
