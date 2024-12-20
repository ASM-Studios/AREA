package controllers

import (
        "AREA/internal/oauth"
        "AREA/internal/pkg"
        "errors"
        "net/http"

        "github.com/gin-gonic/gin"
)

func getServiceID(c *gin.Context) (uint, error) {
        serviceId, err := pkg.GetServiceFromName(c.Param("service"))
        if err != nil {
                c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
                        "message": "Service not found",
                })
                return 0, errors.New("invalid request")
        }
        return serviceId, nil
}

// Login godoc
// @Summary      Login a user with a service
// @Description  Authenticate a user and return a JWT token
// @Tags         oauth
// @Accept       json
// @Produce      json
// @Param        service path string
// @Success      200  {object}  map[string]string
// @Failure      400  {object}  map[string]string
// @Router       /oauth/{service} [post]
func OAuth(c *gin.Context) {
        serviceId, err := getServiceID(c)

        dbToken, err := oauth.BasicServiceCallback(c, serviceId, oauth.OAuthApps[c.Param("service")])
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

// Login godoc
// @Summary      Link a service to an existing account
// @Description  Link a service to an existing account
// @Tags         oauth
// @Accept       json
// @Produce      json
// @Param        service path string
// @Success      200  {object}  map[string]string
// @Failure      400  {object}  map[string]string
// @Router       /oauth/bind/{service} [post]
func OAuthBind(c *gin.Context) {
        serviceId, err := getServiceID(c)

        dbToken, err := oauth.BasicServiceCallback(c, serviceId, oauth.OAuthApps[c.Param("service")])
        if err != nil || dbToken == nil {
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

        c.JSON(http.StatusOK, gin.H{"message": "Bind successful"})
}
