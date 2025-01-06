import 'package:client_mobile/services/oauth/oauth_service.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class OAuthServiceConfig {
  final String scope;
  final String authority;
  final String path;
  final String clientId;
  final String redirectUri;
  final bool pkce;

  OAuthServiceConfig(
      {required this.scope,
      required this.authority,
      required this.path,
      required this.clientId,
      required this.redirectUri,
      required this.pkce});
}

class OAuthConfigManager {
  // Un mapping entre l'ID du service et sa configuration
  static final Map<String, OAuthServiceConfig> _configurations = {
    "microsoft": OAuthServiceConfig(
      scope: "user.read",
      authority: "login.microsoftonline.com/",
      path: "",
      redirectUri: "",
      clientId: dotenv.env["MICROSOFT_CLIENT_ID"] ?? "",
      pkce: false,
    ),
    "google": OAuthServiceConfig(
      scope: "email profile",
      authority: "accounts.google.com/o/oauth2/auth",
      path: "",
      redirectUri: "",
      clientId: dotenv.env["GOOGLE_CLIENT_ID"] ?? "",
      pkce: false,
    ),
    "spotify": OAuthServiceConfig(
      scope: "user-read-private user-read-email",
      authority: "accounts.spotify.com",
      path: "/authorize",
      clientId: dotenv.env["SPOTIFY_CLIENT_ID"] ?? "",
      redirectUri: "my.area.app://callback",
      pkce: false,
    ),
    "discord": OAuthServiceConfig(
      scope: "identify email guilds",
      authority: "discord.com",
      path: "/oauth2/authorize",
      clientId: dotenv.env["DISCORD_CLIENT_ID"] ?? "",
      redirectUri: "my.area.app://callback",
      pkce: true,
    ),
    "twitch": OAuthServiceConfig(
      scope: "user:read:email user:write:chat user:manage:whispers",
      authority: "id.twitch.tv",
      path: "/oauth2/authorize",
      clientId: dotenv.env["TWITCH_CLIENT_ID"] ?? "",
      redirectUri: "https://maelrabot.com/oauth/callback/twitch",
      pkce: false,
    )
  };

  // Fonction pour obtenir la configuration par serviceId
  static OAuthServiceConfig? getServiceConfig(String serviceId) {
    return _configurations[serviceId];
  }
}
