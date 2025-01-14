package pkg

import (
	"gorm.io/gorm"
	"io"
	"log"
	"os"
)

func setupMockEnv() {
	os.Setenv("DB_HOST", "localhost")
	os.Setenv("DB_PORT", "3306")
	os.Setenv("DB_NAME", "testdb")
	os.Setenv("DB_USER", "root")
	os.Setenv("DB_PASSWORD", "password")

	log.SetOutput(io.Discard)
}

var gormOpen = func(dialector gorm.Dialector, opts ...gorm.Option) (*gorm.DB, error) {
	return gorm.Open(dialector, opts...)
}
