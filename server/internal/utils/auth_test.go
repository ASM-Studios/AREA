package utils

import (
	"encoding/base64"
	"testing"
)

func TestRandomSalt(t *testing.T) {
	salt := randomSalt()
	if salt == "" {
		t.Fatal("expected non-empty salt, got empty string")
	}

	decoded, err := base64.RawStdEncoding.DecodeString(salt)
	if err != nil {
		t.Fatalf("failed to decode salt: %v", err)
	}
	if len(decoded) != 16 {
		t.Fatalf("expected salt of 16 bytes, got %d bytes", len(decoded))
	}
}

func TestHashPassword(t *testing.T) {
	testPassword := "myStrongPassword123!"

	hashedPassword, salt := HashPassword(testPassword)
	if hashedPassword == "" {
		t.Error("expected non-empty hashedPassword")
	}
	if salt == "" {
		t.Error("expected non-empty salt")
	}

	err := VerifyPassword(testPassword, hashedPassword, salt)
	if err != nil {
		t.Errorf("expected valid password verification, got error: %v", err)
	}
	err = VerifyPassword("wrongPassword", hashedPassword, salt)
	if err == nil {
		t.Error("expected verification to fail for wrong password, got no error")
	}
}

func TestVerifyPassword(t *testing.T) {
	password := "secret1234"
	hashedPassword, salt := HashPassword(password)
	if err := VerifyPassword(password, hashedPassword, salt); err != nil {
		t.Errorf("expected no error verifying correct password, got: %v", err)
	}
	if err := VerifyPassword("wrongPassword", hashedPassword, salt); err == nil {
		t.Error("expected error verifying wrong password, got none")
	}
}
