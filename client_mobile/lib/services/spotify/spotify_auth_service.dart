import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter/material.dart';
import 'package:flutter_web_auth/flutter_web_auth.dart';

class SpotifyAuthService {
  static final String clientId = dotenv.env["SPOTIFY_CLIENT_ID"] ?? "";
  static final String clientSecret = dotenv.env["SPOTIFY_CLIENT_SECRET"] ?? "";
  static const String redirectUri = "my.area.app://callback";
  static const String authority = "https://login.microsoftonline.com/common";
  static const FlutterSecureStorage secureStorage = FlutterSecureStorage();

  static const String scopes = "user-read-private user-read-email";

  static Future<bool> auth(BuildContext context, {bool signUp = false}) async {
    final authUrl = Uri.https("accounts.spotify.com", "/authorize", {
      "response_type": "code",
      "client_id": clientId,
      "scope": scopes,
      "redirect_uri": redirectUri,
    }).toString();

    print("url spotify : $authUrl");
    try {
      final result = await FlutterWebAuth.authenticate(
        url: authUrl,
        callbackUrlScheme: "my.area.app",
      );
      final code = Uri.parse(result).queryParameters["code"];
      print("code a echanger : $code");
    } catch (e) {
      print("error authentification spotify : $e");
      return (false);
    }

    return (true);
  }
}
