package controllers

import (
	"AREA/internal/models"
	"AREA/internal/oauth"
	"AREA/internal/pkg"
	"errors"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

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
        serviceId := pkg.GetServiceFromName(c.Param("service"))
        if serviceId == -1 {
                c.AbortWithStatusJSON(http.StatusNotFound, gin.H {
                        "message": "Service not found",
                })
                return
        }

        dbToken, err := oauth.BasicServiceCallback(c, uint(serviceId), oauth.OAuthApps[c.Param("service")])
        if err != nil {
                c.AbortWithStatusJSON(http.StatusBadRequest, gin.H {
                        "message": err.Error(),
                })
                return
        }

        user, err := oauth.OAuthRegisterAccount(c, dbToken)
        if err != nil {
                c.AbortWithStatusJSON(http.StatusBadRequest, gin.H {
                        "message": err.Error(),
                })
                return
        }

        c.JSON(http.StatusOK, gin.H {
                "username": user.Username,
                "email": user.Email,
                "jwt": user.Token,
        })
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
        serviceId := pkg.GetServiceFromName(c.Param("service"))
        if serviceId == -1 {
                c.AbortWithStatusJSON(http.StatusNotFound, gin.H {
                        "message": "Service not found",
                })
                return
        }

        dbToken, err := oauth.BasicServiceCallback(c, uint(serviceId), oauth.OAuthApps[c.Param("service")])
        if err != nil {
                c.AbortWithStatusJSON(http.StatusBadRequest, gin.H {
                        "message": err.Error(),
                })
                return
        }

        _, err = oauth.OAuthBindAccount(c, dbToken)
        if err != nil {
                c.AbortWithStatusJSON(http.StatusBadRequest, gin.H {
                        "message": err.Error(),
                })
                return
        }

        c.JSON(http.StatusOK, gin.H {
                "message": "Bind successful",
        })
}

// Refresh godoc
// @Summary      Refresh a service token
// @Description  Refresh a service token
// @Tags         oauth
// @Accept       json
// @Produce      json
// @Param        service path string
// @Success      200  {object}  map[string]string
// @Failure      400  {object}  map[string]string
// @Router       /oauth/refresh/{service} [post]
func OAuthRefresh(c *gin.Context) {
        fmt.Println("REFRESHING") 
        serviceId := pkg.GetServiceFromName(c.Param("service"))
        if serviceId == -1 {
                c.AbortWithStatusJSON(http.StatusNotFound, gin.H {
                        "message": "Service not found",
                })
                return
        }

        var user models.User
        user, err := pkg.GetUserFromToken(c)
        if err != nil {
                c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
                        "message": err.Error(),
                })
                return
        }

        var dbToken models.Token
        err = pkg.DB.Where("user_id = ? AND service_id = ?", user.ID, serviceId).First(&dbToken).Error
        if errors.Is(err, gorm.ErrRecordNotFound) {
                c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
                        "message": "Service not linked",
                })
                return
        }

        err = oauth.FetchNewToken(&dbToken)
        if err != nil {
                c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
                        "message": err.Error(),
                })
                return
        }

        c.JSON(http.StatusOK, gin.H {
                "message": "Token refreshed",
        })
}
