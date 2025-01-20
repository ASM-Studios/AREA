package mail

import (
	"AREA/internal/utils"
	"crypto/tls"
	"errors"
	"fmt"
	"strconv"

	"gopkg.in/gomail.v2"
)

var SMTPClient struct {
        Host            string  `json:"host"`
        Port            int     `json:"port"`
        User            string  `json:"user"`
        Password        string  `json:"password"`
        Dialer          *gomail.Dialer
}

func InitSMTPClient() error {
        if utils.GetEnvVar("SMTP_HOST") == "" || utils.GetEnvVar("SMTP_PORT") == "" || utils.GetEnvVar("SMTP_USER") == "" || utils.GetEnvVar("SMTP_PASSWORD") == "" {
                return errors.New("SMTP environment variables not set")
        }
        SMTPClient.Host = utils.GetEnvVar("SMTP_HOST")
        _, err := strconv.Atoi(utils.GetEnvVar("SMTP_PORT"))
        if err != nil {
                return errors.New("Invalid SMTP port")
        }
        SMTPClient.Port = 1026
        SMTPClient.Host = "host.docker.internal"
        SMTPClient.User = utils.GetEnvVar("SMTP_USER")
        SMTPClient.Password = utils.GetEnvVar("SMTP_PASSWORD")
        SMTPClient.Dialer = gomail.NewDialer(SMTPClient.Host, SMTPClient.Port, SMTPClient.User, SMTPClient.Password)
        SMTPClient.Dialer.TLSConfig = &tls.Config{InsecureSkipVerify: true}
        return nil
}

func SendHTMLMail(to string, object string, content string) error {
        message := gomail.NewMessage()
        message.SetHeader("From", SMTPClient.User)
        message.SetHeader("To", to)
        message.SetHeader("Subject", "AREA")
        message.SetBody("text/html", content)
        err := SMTPClient.Dialer.DialAndSend(message)
        if err != nil {
                return errors.New("Failed to send email")
        } else {
                return nil
        }
}

func SendMail(to string, object string, content string) error {
        message := gomail.NewMessage()
        message.SetHeader("From", SMTPClient.User)
        message.SetHeader("To", to)
        message.SetHeader("Subject", "AREA")
        message.SetBody("text/plain", content)
        err := SMTPClient.Dialer.DialAndSend(message)
        if err != nil {
                fmt.Printf("Failed to send email: %s\n", err)
                return errors.New("Failed to send email")
        } else {
                fmt.Println("Email sent")
                return nil
        }
}
