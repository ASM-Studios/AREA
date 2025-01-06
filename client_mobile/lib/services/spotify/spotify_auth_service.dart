import 'dart:convert';

import 'package:client_mobile/services/oauth/oauth_service.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter/material.dart';
import 'package:flutter_web_auth/flutter_web_auth.dart';
import 'package:http/http.dart' as http;

class SpotifyAuthService {
  static final String clientId = dotenv.env["SPOTIFY_CLIENT_ID"] ?? "";
  static final String clientSecret = dotenv.env["SPOTIFY_CLIENT_SECRET"] ?? "";
  static const String redirectUri = "my.area.app://callback";
  static const FlutterSecureStorage secureStorage = FlutterSecureStorage();

  static const String scopes = "user-read-private user-read-email";

  // static void (String code)
  // {

  // }

  static Future<bool> _fetchSpotifyAccessToken(String code) async {
    final tokenUrl = Uri.https("accounts.spotify.com", "/api/token");

    final response = await http.post(
      tokenUrl,
      headers: {
        "Authorization":
            "Basic ${base64Encode(utf8.encode("$clientId:$clientSecret"))}",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": redirectUri,
      },
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final accessToken = data["access_token"];
      final refreshToken = data["refresh_token"];
      print("Access Token : $accessToken");
      print("Refresh Token : $refreshToken");
      return (accessToken != null);
    } else {
      print("Erreur lors de la récupération du token : ${response.body}");
      return (false);
    }
  }

  static Future<bool> auth(BuildContext context, {bool signUp = false}) async {
    final authUrl = Uri.https("accounts.spotify.com", "/authorize", {
      "response_type": "code",
      "client_id": clientId,
      "scope": scopes,
      "redirect_uri": redirectUri,
      "force_login": "true"
    }).toString();

    // print("url spotify : $authUrl");
    return await OAuthService.showWebView(context, "spotify");
  }
}
