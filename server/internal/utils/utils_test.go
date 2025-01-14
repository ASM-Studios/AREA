package utils

import (
	"AREA/tests/mocks"
	"bytes"
	"errors"
	"io/ioutil"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetEnvVar(t *testing.T) {
	t.Setenv("TEST_VAR", "test_value")
	value := GetEnvVar("TEST_VAR")
	assert.Equal(t, "test_value", value)
	value = GetEnvVar("MISSING_VAR")
	assert.Equal(t, "", value)
}

func TestSendRequest(t *testing.T) {
	mockResponse := &http.Response{
		StatusCode: 200,
		Body:       ioutil.NopCloser(bytes.NewBufferString(`{"message": "success"}`)),
	}
	mockTransport := &mocks.MockTransport{
		RoundTripFunc: func(req *http.Request) (*http.Response, error) {
			assert.Equal(t, "http://example.com", req.URL.String())
			return mockResponse, nil
		},
	}
	client := &http.Client{Transport: mockTransport}
	http.DefaultClient = client
	req, _ := http.NewRequest("GET", "http://example.com", nil)
	response, err := SendRequest(req)
	assert.NoError(t, err)
	assert.Equal(t, 200, response.StatusCode)
}

func TestSendRequest_Error(t *testing.T) {
	mockTransport := &mocks.MockTransport{
		RoundTripFunc: func(req *http.Request) (*http.Response, error) {
			return nil, errors.New("network error")
		},
	}
	client := &http.Client{Transport: mockTransport}
	http.DefaultClient = client
	req, _ := http.NewRequest("GET", "http://example.com", nil)

	response, err := SendRequest(req)
	assert.Nil(t, response)
	assert.Contains(t, err.Error(), "network error")
}

func TestExtractBody(t *testing.T) {
	resp := &http.Response{
		Body: ioutil.NopCloser(bytes.NewBufferString(`{"message": "success"}`)),
	}

	type ResponseBody struct {
		Message string `json:"message"`
	}

	body, err := ExtractBody[ResponseBody](resp)
	assert.NoError(t, err)
	assert.Equal(t, "success", body.Message)
}
