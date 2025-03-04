package services

import (
	"database/sql"
	amqp "github.com/rabbitmq/amqp091-go"
	"time"
)

type DBInterface interface {
	Ping() error
}

type RabbitMQInterface interface {
	IsClosed() bool
}

type HealthService struct {
	db  DBInterface
	rmq RabbitMQInterface
}

type SQLDBWrapper struct {
	DB *sql.DB
}

func (s *SQLDBWrapper) Ping() error {
	return s.DB.Ping()
}

type AMQPWrapper struct {
	Connection *amqp.Connection
}

func (a *AMQPWrapper) IsClosed() bool {
	return a.Connection.IsClosed()
}

type HealthStatus struct {
	Status    string         `json:"status"`
	Database  ComponentCheck `json:"database"`
	RabbitMQ  ComponentCheck `json:"rabbitmq"`
	Timestamp string         `json:"timestamp"`
}

type ComponentCheck struct {
	Status  string `json:"status"`
	Message string `json:"message,omitempty"`
}

var healthService *HealthService

func NewHealthService(db DBInterface, rmq RabbitMQInterface) *HealthService {
	return &HealthService{
		db:  db,
		rmq: rmq,
	}
}

func InitHealthService(db DBInterface, rmq RabbitMQInterface) {
	healthService = NewHealthService(db, rmq)
}

func GetHealthService() *HealthService {
	return healthService
}

func (h *HealthService) Check() HealthStatus {
	status := HealthStatus{
		Status:    "ok",
		Timestamp: time.Now().UTC().Format(time.RFC3339),
	}
	status.Database = h.checkDatabase()
	status.RabbitMQ = h.checkRabbitMQ()

	if status.Database.Status != "ok" || status.RabbitMQ.Status != "ok" {
		status.Status = "error"
	}

	return status
}

func (h *HealthService) checkDatabase() ComponentCheck {
	if err := h.db.Ping(); err != nil {
		return ComponentCheck{
			Status:  "error",
			Message: "Database connection failed",
		}
	}
	return ComponentCheck{Status: "ok"}
}

func (h *HealthService) checkRabbitMQ() ComponentCheck {
	if h.rmq == nil || h.rmq.IsClosed() {
		return ComponentCheck{
			Status:  "error",
			Message: "RabbitMQ connection is closed",
		}
	}
	return ComponentCheck{Status: "ok"}
}
