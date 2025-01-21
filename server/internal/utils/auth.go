package utils

import (
	"crypto/rand"
	"encoding/base64"
	"errors"
	"golang.org/x/crypto/argon2"
	"log"
)

func VerifyPassword(password, hashedPassword, salt string) error {
	hash := argon2.IDKey([]byte(password), []byte(salt), 1, 64*1024, 4, 32)
	if base64.RawStdEncoding.EncodeToString(hash) != hashedPassword {
		return errors.New("invalid password")
	}
	return nil
}

func randomSalt() string {
	salt := make([]byte, 16)
	_, err := rand.Read(salt)
	if err != nil {
		log.Print(err)
		return ""
	}
	return base64.RawStdEncoding.EncodeToString(salt)
}

func HashPassword(password string) (string, string) {
	salt := randomSalt()
	hash := argon2.IDKey([]byte(password), []byte(salt), 1, 64*1024, 4, 32)
	return base64.RawStdEncoding.EncodeToString(hash), salt
}
