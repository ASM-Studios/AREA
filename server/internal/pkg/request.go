package pkg

import (
	"bytes"
	"fmt"
	"github.com/gin-gonic/gin"
	"io"
)

func PrintRequestJSON(c *gin.Context) {
	var requestBody bytes.Buffer
	_, err := io.Copy(&requestBody, c.Request.Body)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to read request body"})
		return
	}
	fmt.Println("Request JSON:", requestBody.String())
	c.Request.Body = io.NopCloser(bytes.NewBuffer(requestBody.Bytes()))
}
