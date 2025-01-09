import 'package:area/services/oauth/oauth_service.dart';
import 'package:area/widgets/sign_in_button.dart';
import 'package:flutter/material.dart';

class BindOAuthButtons extends StatelessWidget {
  final List<String> servicesBinded;

  const BindOAuthButtons({super.key, required this.servicesBinded});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SignInButton(
          onPressed: () {
            OAuthService.requestOAuth(context, "google", signUp: false);
          },
          label: "Link with Google",
          image: Image.asset(
            "assets/images/google.png",
            width: 34,
            height: 20,
          ),
          activated: !servicesBinded.contains("google"),
        ),
        SignInButton(
          onPressed: () {
            OAuthService.requestOAuth(context, "microsoft", signUp: false);
          },
          label: "Link with Microsoft",
          image: Image.asset(
            "assets/images/microsoft.png",
            width: 33,
            height: 20,
          ),
          activated: !servicesBinded.contains("microsoft"),
        ),
        SignInButton(
          onPressed: () {
            OAuthService.requestOAuth(context, "github", signUp: false);
          },
          label: "Link with Github",
          image: Image.asset(
            "assets/images/github.png",
            width: 33,
            height: 20,
          ),
          activated: !servicesBinded.contains("github"),
        ),
        SignInButton(
          onPressed: () {
            OAuthService.requestOAuth(context, "discord", signUp: false);
          },
          label: "Link with Discord",
          image: Image.asset(
            "assets/images/discord.png",
            width: 38,
            height: 20,
          ),
          activated: !servicesBinded.contains("discord"),
        ),
        SignInButton(
          onPressed: () {
            OAuthService.requestOAuth(context, "twitch", signUp: false);
          },
          label: "Link with Twitch",
          image: Image.asset(
            "assets/images/twitch.png",
            width: 37,
            height: 20,
          ),
          activated: !servicesBinded.contains("twitch"),
        ),
        SignInButton(
          onPressed: () {
            OAuthService.requestOAuth(context, "spotify", signUp: false);
          },
          label: "Link with Spotify",
          image: Image.asset(
            "assets/images/spotify_green.png",
            width: 37,
            height: 20,
          ),
          activated: !servicesBinded.contains("spotify"),
        ),
      ],
    );
  }
}
