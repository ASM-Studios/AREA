package controllers

import (
        "AREA/internal/controllers/oauth"
        "AREA/internal/pkg"
        "errors"
        "net/http"

        "github.com/gin-gonic/gin"
)

var OAuthApps = map[string]oauth.ServiceApp {
        "microsoft": {ServiceName: "microsoft", ClientId: "MICROSOFT_CLIENT_ID", ClientSecret: "MICROSOFT_CLIENT_SECRET", TokenURL: "https://login.microsoftonline.com/common/oauth2/v2.0/token", MeURL: "https://graph.microsoft.com/v1.0/me"},
        "github": {ServiceName: "github", ClientId: "GITHUB_CLIENT_ID", ClientSecret: "GITHUB_CLIENT_SECRET", TokenURL: "https://github.com/login/oauth/access_token", MeURL: "https://api.github.com/user"},
        "spotify": {ServiceName: "spotify", ClientId: "SPOTIFY_CLIENT_ID", ClientSecret: "SPOTIFY_CLIENT_SECRET", TokenURL: "https://accounts.spotify.com/api/token", MeURL: "https://api.spotify.com/v1/me"},
        "twitch": {ServiceName: "twitch", ClientId: "TWITCH_CLIENT_ID", ClientSecret: "TWITCH_CLIENT_SECRET", TokenURL: "https://id.twitch.tv/oauth2/token", MeURL: "https://api.twitch.tv/helix/users"},
        "discord": {ServiceName: "discord", ClientId: "DISCORD_CLIENT_ID", ClientSecret: "DISCORD_CLIENT_SECRET", TokenURL: "https://discord.com/api/oauth2/token", MeURL: "https://discord.com/api/users/@me"},
        "google": {ServiceName: "google", ClientId: "GOOGLE_CLIENT_ID", ClientSecret: "GOOGLE_CLIENT_SECRET", TokenURL: "https://oauth2.googleapis.com/token", MeURL: "https://www.googleapis.com/oauth2/v1/userinfo"},
}

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

        dbToken, err := oauth.BasicServiceCallback(c, serviceId, OAuthApps[c.Param("service")])
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

        dbToken, err := oauth.BasicServiceCallback(c, serviceId, OAuthApps[c.Param("service")])
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

        c.JSON(http.StatusOK, gin.H{"message": "Bind successful"})
}
