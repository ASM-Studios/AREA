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
      scope: "User.read Mail.Read Mail.ReadWrite Mail.Send Team.ReadBasic.All Channel.ReadBasic.All ChannelMessage.Send Chat.ReadWrite Files.ReadWrite.All Presence.ReadWrite Calendars.ReadWrite",
      authority: "login.microsoftonline.com",
      path: "/common/oauth2/v2.0/authorize",
      redirectUri: "https://localhost:8081/auth/microsoft/callback",
      clientId: dotenv.env["MICROSOFT_CLIENT_ID"] ?? "",
      pkce: false,
    ),
    "google": OAuthServiceConfig(
      scope: "email profile",
      authority: "accounts.google.com",
      path: "/o/oauth2/v2/auth",
      redirectUri: "https://maelrabot.com/oauth/callback/google",
      clientId: dotenv.env["GOOGLE_CLIENT_ID"] ?? "",
      pkce: false,
    ),
    "spotify": OAuthServiceConfig(
      scope: "user-read-private user-read-email user-modify-playback-state user-read-playback-state playlist-read-private playlist-modify-public playlist-modify-private",
      authority: "accounts.spotify.com",
      path: "/authorize",
      clientId: dotenv.env["SPOTIFY_CLIENT_ID"] ?? "",
      redirectUri: "https://localhost:8081/auth/spotify/callback",
      pkce: false,
    ),
    "discord": OAuthServiceConfig(
      scope: "identify email guilds",
      authority: "discord.com",
      path: "/oauth2/authorize",
      clientId: dotenv.env["DISCORD_CLIENT_ID"] ?? "",
      redirectUri: "https://localhost:8081/auth/discord/callback",
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
