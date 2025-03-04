import 'package:area/config/settings_config.dart';
import 'package:area/config/translation_config.dart';
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
          label: "${TranslationConfig.translate(
              "bind",
              language: SettingsConfig.language,
            )} Google",
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
          label: "${TranslationConfig.translate(
              "bind",
              language: SettingsConfig.language,
            )} Microsoft",
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
          label: "${TranslationConfig.translate(
              "bind",
              language: SettingsConfig.language,
            )} Github",
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
          label: "${TranslationConfig.translate(
              "bind",
              language: SettingsConfig.language,
            )} Discord",
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
          label: "${TranslationConfig.translate(
              "bind",
              language: SettingsConfig.language,
            )} Twitch",
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
          label: "${TranslationConfig.translate(
              "bind",
              language: SettingsConfig.language,
            )} Spotify",
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
