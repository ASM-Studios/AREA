import 'package:client_mobile/pages/auth/register.dart';
import 'package:client_mobile/services/discord/discord_auth_service.dart';
import 'package:client_mobile/services/google/google_auth_service.dart';
import 'package:client_mobile/services/microsoft/microsoft_auth_service.dart';
import 'package:client_mobile/services/spotify/spotify_auth_service.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class OAuthService {
  const OAuthService();

  static void handleOAuth(BuildContext context, String serviceId,
      {required bool signUp}) async {
    bool isRegistered;
    switch (serviceId) {
      case "microsoft":
        isRegistered = await MicrosoftAuthService.auth(context, signUp: true);
        break;
      case "google":
        isRegistered = await GoogleAuthService.auth(context, signUp: true);
        break;
      case "spotify":
        isRegistered = await SpotifyAuthService.auth(context, signUp: true);
        break;
      case "discord":
        isRegistered = await DiscordAuthService.auth(context, signUp: true);
        break;
      default:
        isRegistered = false;
        break;
    }

    if (!context.mounted) {
      return;
    }

    if (isRegistered) {
      context.pushReplacement("/dashboard");
    }
  }
}
