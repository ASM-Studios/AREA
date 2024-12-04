// import 'dart:io';
import 'package:client_mobile/services/microsoft/MicrosoftAuthService.dart';
import 'package:client_mobile/widgets/button.dart';
import 'package:client_mobile/widgets/clickable_text.dart';
import 'package:client_mobile/widgets/form_field.dart';
import 'package:client_mobile/widgets/sign_in_button.dart';
import 'package:client_mobile/widgets/simple_text.dart';
import 'package:flutter/material.dart';
import 'package:flutter_appauth/flutter_appauth.dart';
import 'package:go_router/go_router.dart';
import 'package:oauth2/oauth2.dart' as oauth2;
import 'package:flutter_dotenv/flutter_dotenv.dart';

class RegisterPage extends StatefulWidget {
  @override
  _RegisterPageState createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final String callbackUrlScheme = 'my.area.app';
  String get redirectUrlMobile => '$callbackUrlScheme://callback';

  final String clientId = dotenv.env["VITE_SPOTIFY_CLIENT_ID"] ?? "";
  final appAuth = FlutterAppAuth();
  final String clientSecret = dotenv.env["VITE_SPOTIFY_CLIENT_SECRET"] ?? "";
  final String issuer = "https://accounts.spotify.com/";
  final Uri authorizationEndpoint =
      Uri.parse('https://accounts.spotify.com/authorize');
  final Uri tokenEndpoint = Uri.parse('https://accounts.spotify.com/api/token');
  final String redirectUrlWeb = "https://localhost:8081/auth/spotify/callback";
  final Uri redirectUri =
      Uri.parse('https://localhost:8081/auth/spotify/callback');
  oauth2.Client? client;

  Future<void> authenticateWithSpotifyOld() async {
    try {
      final authorizationTokenRequest = AuthorizationTokenRequest(
          clientId, redirectUrlMobile,
          issuer: issuer,
          clientSecret: clientSecret,
          scopes: ["openid", "profile", "email", "offline_access"],
          additionalParameters: {'show_dialog': 'true'});

      final result =
          await appAuth.authorizeAndExchangeCode(authorizationTokenRequest);

      print("--------------------------------");
      print("");
      print("");
      print("Le code échangé est le suivant : ${result}");
      print("");
      print("");
      print("--------------------------------");

      return;
    } catch (e) {
      print('Authentication failed: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: client == null
            ? Container(
                padding: const EdgeInsets.all(20),
                child: SingleChildScrollView(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SimpleText(
                        "Username",
                        bold: true,
                      ),
                      const AreaFormField(label: "Value"),
                      const SizedBox(height: 25),
                      const SimpleText("Password", bold: true),
                      const AreaFormField(label: "Value"),
                      const SizedBox(height: 15),
                      const SimpleText("Confirm password", bold: true),
                      const AreaFormField(label: "Value"),
                      const SizedBox(height: 15),
                      Align(
                        alignment: Alignment.center,
                        child: AreaButton(
                          label: "Register",
                          onPressed: () {},
                          color: Colors.black,
                        ),
                      ),
                      const SizedBox(height: 30),
                      Align(
                        alignment: Alignment.center,
                        child: SignInButton(
                          onPressed: () {
                            MicrosoftAuthService.auth(context);
                          },
                          label: "Sign in with Microsoft",
                          image: Image.asset(
                            "assets/images/microsoft_logo.png",
                            width: 40,
                            height: 30,
                          ),
                        ),
                      ),
                      const SizedBox(height: 5),
                      Align(
                        alignment: Alignment.center,
                        child: SmallClickableText(
                          "I already have an account",
                          onPressed: () {
                            context.pop();
                          },
                        ),
                      )
                    ],
                  ),
                ),
              )
            : Text(
                'Authenticated! Access token: ${client?.credentials.accessToken}'),
      ),
    );
  }
}
