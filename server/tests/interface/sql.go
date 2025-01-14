package _interface

import (
	"AREA/internal/models"
	"database/sql"
)

type DBInterface interface {
	Ping() error
	Where(query string, args ...interface{}) ([]models.Service, error)
}

type SQLDBWrapper struct {
	DB *sql.DB
}

func (s *SQLDBWrapper) Ping() error {
	return s.DB.Ping()
}

func (s *SQLDBWrapper) Where(query string, args ...interface{}) ([]models.Service, error) {
	return []models.Service{}, nil
}
