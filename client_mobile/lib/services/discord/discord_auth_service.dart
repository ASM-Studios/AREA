import 'dart:convert';
import 'package:client_mobile/services/oauth/oauth_service.dart';
import 'package:client_mobile/tools/utils.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter/material.dart';
import 'package:flutter_web_auth/flutter_web_auth.dart';
import 'package:http/http.dart' as http;
import 'package:oauth2_client/oauth2_client.dart';

class DiscordAuthService {
  static final String clientId = dotenv.env["DISCORD_CLIENT_ID"] ?? "";
  static final String clientSecret = dotenv.env["DISCORD_CLIENT_SECRET"] ?? "";
  static const String redirectUri = "my.area.app://callback";
  static const FlutterSecureStorage secureStorage = FlutterSecureStorage();

  static const String scopes = "identify email guilds";

  static Future<bool> _fetchDiscordAccessToken(
      String authorizationCode, String codeVerifier) async {
    final tokenUrl = Uri.https("discord.com", "/api/oauth2/token");

    final response = await http.post(
      tokenUrl,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: {
        "grant_type": "authorization_code",
        "code": authorizationCode,
        "redirect_uri": redirectUri,
        "code_verifier": codeVerifier,
        "client_id": clientId,
        "client_secret": clientSecret,
      },
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final accessToken = data["access_token"];
      final refreshToken = data["refresh_token"];
      print("Access Token : $accessToken");
      // print("Refresh Token : $refreshToken");
      return (accessToken != null);
    } else {
      print("Erreur lors de la récupération du token : ${response.body}");
      return (false);
    }
  }

  static Future<bool> auth(BuildContext context, {bool signUp = false}) async {
    final String codeVerifier = Utils.generateCodeVerifier();
    final String codeChallenge = Utils.generateCodeChallenge(codeVerifier);

    final authUrl = Uri.https("discord.com", "oauth2/authorize", {
      "response_type": "code",
      "client_id": clientId,
      "scope": scopes,
      "redirect_uri": redirectUri,
      "code_challenge": codeChallenge,
      "code_challenge_method": "S256"
    }).toString();

    return await OAuthService.requestOAuth(context, "discord");
  }
}
