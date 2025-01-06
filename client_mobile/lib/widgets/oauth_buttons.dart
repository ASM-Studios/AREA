import 'package:client_mobile/services/oauth/oauth_service.dart';
import 'package:client_mobile/widgets/sign_in_button.dart';
import 'package:flutter/material.dart';

class OAuthButtons extends StatelessWidget {
  // final bool isLoggingViaOauth;
  // final Function(BuildContext context, String provider) onSignIn;

  bool isLoggingViaOAuth = false;

  OAuthButtons();

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            SignInButton(
              onPressed: () {
                if (!isLoggingViaOAuth) {
                  isLoggingViaOAuth = true;
                  OAuthService.requestOAuth(context, "google", signUp: true);
                  isLoggingViaOAuth = false;
                }
              },
              label: "Google",
              image: Image.asset(
                "assets/images/google.png",
                width: 34,
                height: 20,
              ),
            ),
            SignInButton(
              onPressed: () {
                if (!isLoggingViaOAuth) {
                  isLoggingViaOAuth = true;
                  OAuthService.requestOAuth(context, "microsoft", signUp: true);
                  isLoggingViaOAuth = false;
                }
              },
              label: "Microsoft",
              image: Image.asset(
                "assets/images/microsoft.png",
                width: 33,
                height: 20,
              ),
            ),
            SignInButton(
              onPressed: () {
                if (!isLoggingViaOAuth) {
                  isLoggingViaOAuth = true;
                  OAuthService.requestOAuth(context, "github", signUp: true);
                  isLoggingViaOAuth = false;
                }
              },
              label: "Github",
              image: Image.asset(
                "assets/images/github.png",
                width: 33,
                height: 20,
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            SignInButton(
              onPressed: () {
                if (!isLoggingViaOAuth) {
                  isLoggingViaOAuth = true;
                  OAuthService.requestOAuth(context, "discord", signUp: true);
                  isLoggingViaOAuth = false;
                }
              },
              label: "Discord",
              image: Image.asset(
                "assets/images/discord.png",
                width: 38,
                height: 20,
              ),
            ),
            SignInButton(
              onPressed: () {
                if (!isLoggingViaOAuth) {
                  isLoggingViaOAuth = true;
                  OAuthService.requestOAuth(context, "twitch", signUp: true);
                  isLoggingViaOAuth = false;
                }
              },
              label: "Twitch",
              image: Image.asset(
                "assets/images/twitch.png",
                width: 37,
                height: 20,
              ),
            ),
            SignInButton(
              onPressed: () {
                if (!isLoggingViaOAuth) {
                  isLoggingViaOAuth = true;
                  OAuthService.requestOAuth(context, "spotify",signUp: true);
                  isLoggingViaOAuth = false;
                }
              },
              label: "Spotify",
              image: Image.asset(
                "assets/images/spotify_green.png",
                width: 37,
                height: 20,
              ),
            ),
          ],
        ),
      ],
    );
  }
}
