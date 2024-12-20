import 'dart:convert';

import 'package:client_mobile/tools/utils.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter/material.dart';
import 'package:flutter_web_auth/flutter_web_auth.dart';
import 'package:http/http.dart' as http;

class GoogleAuthService {
  static final String clientId = dotenv.env["GOOGLE_CLIENT_ID"] ?? "";
  static final String clientSecret = dotenv.env["GOOGLE_CLIENT_SECRET"] ?? "";
  static const String redirectUri = "my.area.app";
  static const FlutterSecureStorage secureStorage = FlutterSecureStorage();

  static const String scopes = "email profile";

  static Future<bool> auth(BuildContext context, {bool signUp = false}) async {
    final codeVerifier = Utils.generateCodeVerifier();
    final codeChallenge = Utils.generateCodeChallenge(codeVerifier);

    final authUrl = Uri.https("accounts.google.com", "/o/oauth2/v2/auth", {
      "response_type": "code",
      "client_id": clientId,
      "scope": scopes,
      "redirect_uri": redirectUri,
      "code_challenge": codeChallenge,
      "code_challenge_method": "S256"
    }).toString();

    print("url spotify : $authUrl");
    try {
      final result = await FlutterWebAuth.authenticate(
        url: authUrl,
        callbackUrlScheme: "my.area.app",
      );
      final code = Uri.parse(result).queryParameters["code"];
      if (code == null) return (false);
      print("code a echanger : $code");
      return (true);
    } catch (e) {
      print("error authentification google : $e");
      return (false);
    }
  }
}
