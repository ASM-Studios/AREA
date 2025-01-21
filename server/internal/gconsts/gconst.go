package gconsts

import (
	"AREA/internal/amqp"
)

const EnvFile = ".env"
const EnvFileDirectory = "."

const ServiceFileDirectory = "./services"

const ExchangeName = "api_service_exchange"

var Connection *amqp.Connection = nil

var ServiceMap = make(map[string]uint)

var RegisterMail string = `
<p>Hello,</p>

<p>Thank you for registering on our platform. Please verify your email from the settings page.</p>

<p>If you did not register on our platform, please ignore this email.</p>

<p>Thanks,</p>
<p>ASM Team</p>
`
