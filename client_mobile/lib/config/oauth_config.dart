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
  static final Map<String, OAuthServiceConfig> _configurations = {
    "microsoft": OAuthServiceConfig(
      scope: "user.read Mail.Read Mail.ReadWrite Mail.Send",
      authority: "login.microsoftonline.com",
      path: "/common/oauth2/v2.0/authorize",
      redirectUri: "msauth://my.area.app/lvGC0B4SWYU8tNPHg%2FbdMjQinZQ%3D",
      clientId: dotenv.env["MICROSOFT_CLIENT_ID"] ?? "",
      pkce: false,
    ),
    "google": OAuthServiceConfig(
      scope: "email profile",
      authority: "accounts.google.com",
      path: "/o/oauth2/v2/auth",
      redirectUri: "https://maelrabot.com/oauth/callback/google",
      // redirectUri: "https://localhost:8081/auth/google/callback",
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
    ),
    "github": OAuthServiceConfig(
      scope: "read:user user:email repo",
      authority: "github.com",
      path: "/login/oauth/authorize",
      clientId: dotenv.env["GITHUB_CLIENT_ID"] ?? "",
      redirectUri: "https://localhost:8081/auth/github/callback",
      pkce: false,
    )
  };

  static OAuthServiceConfig? getServiceConfig(String serviceId) {
    return _configurations[serviceId];
  }
}
