import 'dart:convert';

import 'package:aad_oauth/model/config.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter/material.dart';
import 'package:aad_oauth/aad_oauth.dart';
import '../../main.dart';
import 'package:http/http.dart' as http;

class MicrosoftAuthService {
  static final String clientId = dotenv.env["VITE_MICROSOFT_CLIENT_ID"] ?? "";
  static const String redirectUri =
      "msauth://my.area.app/lvGC0B4SWYU8tNPHg%2FbdMjQinZQ%3D";
  static const String authority = "https://login.microsoftonline.com/common";
  static const FlutterSecureStorage secureStorage = FlutterSecureStorage();

  static Future<bool> linkToken(String token, {bool signUp = false}) async {
    String baseUrl = dotenv.env["BACKEND_BASE_URL"] ?? "http://localhost:8080";
    final response = await http.post(
      Uri.parse('$baseUrl/oauth/microsoft'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({"token": token}),
    );

    // dans ce cas là on link le jwt recu avec notre bearer_token
    if (signUp) {
      final responseData = jsonDecode(response.body);
      await secureStorage.write(
          key: 'bearer_token', value: responseData["jwt"]);
    }

    return response.statusCode == 200;
  }

  static Future<bool> auth(BuildContext context, {bool signUp = false}) async {
    final Config config = Config(
        tenant: "common",
        clientId: clientId,
        scope: "https://graph.microsoft.com/.default",
        navigatorKey: navigatorKey,
        redirectUri: redirectUri);
    config.webUseRedirect = false;

    final AadOAuth oauth = AadOAuth(config);
    final result = await oauth.login();
    result.fold(
      (l) => ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(l.message),
          backgroundColor: Colors.red,
        ),
      ),
      (r) async {
        bool hasLinked = await linkToken(r.accessToken!, signUp: signUp);
        print("access token microsoft = : ${r.accessToken}");

        if (hasLinked) {
          await secureStorage.write(
              key: 'microsoft_access_token', value: r.accessToken);
          return (true);
        } else {
          return (false);
        }
      },
    );
    return (true);
  }
}
