package gconsts

import "AREA/internal/amqp"

const EnvFile = ".env"
const EnvFileDirectory = "."

const ServiceFileDirectory = "./services"

const ExchangeName = "api_service_exchange"

var Connection *amqp.Connection = nil

var ServiceMap = make(map[string]uint)
