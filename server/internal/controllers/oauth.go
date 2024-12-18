package controllers

import (
	"AREA/internal/controllers/oauth"
	"AREA/internal/models"
	"AREA/internal/pkg"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
)

type OAuthCallback func(c *gin.Context) (*models.Token, error)

var OAuthCallbacks = map[string]OAuthCallback {
    //"google": googleCallback,
    "microsoft": oauth.MicrosoftCallback,
    "spotify": oauth.SpotifyCallback,
    "github": oauth.GithubCallback,
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
        dbToken, err := OAuthCallbacks[c.Param("service")](c)
        if err != nil || dbToken == nil {
                c.AbortWithStatusJSON(http.StatusBadRequest, gin.H {
                        "message": "Invalid request",
                })
                return
        }

        user, err := oauth.OAuthRegisterAccount(c, dbToken)
        if err != nil {
                c.AbortWithStatusJSON(http.StatusBadRequest, gin.H {
                        "message": "Invalid request",
                })
                return
        }

        c.JSON(http.StatusOK, gin.H{"username": user.Username, "email": user.Email, "jwt": user.Token})
}

func OAuthBind(c *gin.Context) {
        dbToken, err := OAuthCallbacks[c.Param("service")](c)
        if err != nil {
                c.AbortWithStatusJSON(http.StatusBadRequest, gin.H {
                        "message": "Invalid request",
                })
                return
        }

        _, err = oauth.OAuthBindAccount(c, dbToken)
        if err != nil {
                c.AbortWithStatusJSON(http.StatusBadRequest, gin.H {
                        "message": "Invalid request",
                })
                return
        }

        //oauth.OAuthLogin(c, *serviceInfo, token);
        c.JSON(http.StatusOK, gin.H{"message": "Bind successful"})
}
