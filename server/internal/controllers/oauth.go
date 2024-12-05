package controllers

import (
	"AREA/internal/controllers/oauth"
	"AREA/internal/models"
	"AREA/internal/pkg"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Token struct {
        Token   string  `json:"token" binding:"required"`
}

type OAuthCallback func(c *gin.Context, token *models.Token) (*models.User, error)

var OAuthCallbacks = map[string]OAuthCallback {
    //"google": googleCallback,
    "microsoft": oauth.MicrosoftCallback,
}

func getServiceID(c *gin.Context) (uint, error) {
        serviceId, err := pkg.GetServiceFromName(c.Param("service"))
        if err != nil {
                c.AbortWithStatusJSON(http.StatusBadRequest, gin.H {
                        "message": "Service not found",
                })
                return 0, errors.New("Invalid request")
        }
        return serviceId, nil
}

func OAuth(c *gin.Context) {
        var token Token
        if err := c.ShouldBindJSON(&token); err != nil {
                c.AbortWithStatusJSON(http.StatusBadRequest, gin.H {
                        "message": "Invalid request",
                })
        }


        serviceId, err := getServiceID(c)
        if err != nil {
            return
        }

        var dbToken models.Token
        dbToken.Value = token.Token
        dbToken.ServiceID = serviceId
        user, err := OAuthCallbacks[c.Param("service")](c, &dbToken)
        dbToken.UserID = user.ID
        if err != nil {
                return
        }

        c.JSON(http.StatusOK, gin.H{"username": user.Username, "email": user.Email, "jwt": user.Token})
}

/*func OAuthBind(c *gin.Context) {
        var token Token
        if err := c.ShouldBindJSON(&token); err != nil {
                c.AbortWithStatusJSON(http.StatusBadRequest, gin.H {
                        "message": "Invalid request",
                })
                return
        }
        userId, err := pkg.GetUserFromToken(c)
        if err != nil {
                c.AbortWithStatusJSON(http.StatusBadRequest, gin.H {
                        "message": "User not found",
                })
        }
        serviceId, err := pkg.GetServiceFromName(c.Param("service"))
        if err != nil {
                c.AbortWithStatusJSON(http.StatusBadRequest, gin.H {
                        "message": "Service not found",
                })
                return
        }

        var dbToken models.Token
        dbToken.Value = token.Token
        dbToken.UserID = userId
        dbToken.ServiceID = serviceId
}*/
