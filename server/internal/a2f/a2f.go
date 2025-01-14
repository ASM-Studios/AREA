package a2f

import (
	"AREA/internal/mail"
	"AREA/internal/models"
	"AREA/internal/pkg"
	"fmt"
	"math/rand"
	"strconv"
	"time"
)

func GenerateMailCode(user *models.User) {
        code := models.MailCode {
                Code: uint(rand.Int() % 1000000),
                ExpiresAt: uint(time.Now().Unix() + 300),
                UserID: user.ID,
        }
        pkg.DB.Create(&code)
        mail.SendMail(user.Email, "Welcome to AREA", fmt.Sprintf("Welcome to AREA, your verification code is %d\nIt is valid for 5 minutes", code.Code))
}

func ValidateMailCode(user *models.User, code *models.A2FRequest) bool {
        rows, err := pkg.DB.Table("mail_codes").Where("user_id = ?", user.ID).Rows()
        if err != nil {
                return false
        }
        for rows.Next() {
                var mailCode models.MailCode
                pkg.DB.ScanRows(rows, &mailCode)
                if mailCode.ExpiresAt < uint(time.Now().Unix()) {
                        pkg.DB.Delete(&mailCode)
                        continue
                }
                codeValue, err := strconv.Atoi(code.Code)
                if err != nil {
                        continue
                }
                if mailCode.Code == uint(codeValue) {
                        pkg.DB.Delete(&mailCode)
                        return true
                }
        }

        return false
}
