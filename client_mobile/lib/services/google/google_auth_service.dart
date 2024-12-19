import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter/material.dart';
import 'package:google_sign_in/google_sign_in.dart';

class GoogleAuthService {
  static final String clientId = dotenv.env["GOOGLE_CLIENT_ID"] ?? "";
  static const String redirectUri =
      "msauth://my.area.app/lvGC0B4SWYU8tNPHg%2FbdMjQinZQ%3D";
  static const String authority = "https://login.microsoftonline.com/common";
  static const FlutterSecureStorage secureStorage = FlutterSecureStorage();

  static const List<String> scopes = <String>[
    'email',
    'profile',
  ];

  static Future<bool> auth(BuildContext context, {bool signUp = false}) async {
    print("google client id = $clientId");
    GoogleSignIn _googleSignIn =
        GoogleSignIn(clientId: clientId, scopes: scopes);
    GoogleSignInAccount? account = await _googleSignIn.signIn();
    if (account == null) return (false);
    final GoogleSignInAuthentication googleAuth = await account.authentication;
    print("google access token : ${googleAuth.accessToken}");
    return (true);
  }
}
