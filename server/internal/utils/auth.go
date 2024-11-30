package utils

import (
	"encoding/base64"
	"golang.org/x/crypto/argon2"
)

func HashPassword(password string) string {
	salt := []byte("randomSalt") // Ideally, generate a unique salt per user
	hash := argon2.IDKey([]byte(password), salt, 1, 64*1024, 4, 32)
	return base64.RawStdEncoding.EncodeToString(hash)
}
