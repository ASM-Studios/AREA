import 'package:aad_oauth/model/config.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter/material.dart';
import 'package:aad_oauth/aad_oauth.dart';
import '../../main.dart';

class MicrosoftAuthService {
  static final String clientId = dotenv.env["VITE_MICROSOFT_CLIENT_ID"] ?? "";
  static const String redirectUri =
      "msauth://my.area.app/lvGC0B4SWYU8tNPHg%2FbdMjQinZQ%3D";
  static const String authority = "https://login.microsoftonline.com/common";
  static const FlutterSecureStorage secureStorage = FlutterSecureStorage();

  static Future<void> auth(BuildContext context) async {
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
        await secureStorage.write(key: 'microsoft_access_token', value: r.accessToken);
        print("access token = : ${r.accessToken}");
      },
    );
  }
}
