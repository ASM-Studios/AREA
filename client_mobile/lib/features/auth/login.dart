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
import 'package:flutter_dotenv/flutter_dotenv.dart';

class LoginPage extends StatefulWidget {
  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final String callbackUrlScheme = 'my.area.app';
  String get spotifyRedirectUrlMobile => '$callbackUrlScheme://callback';

  final String clientId = dotenv.env["VITE_SPOTIFY_CLIENT_ID"] ?? "";
  final appAuth = FlutterAppAuth();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
          child: Container(
        padding: const EdgeInsets.all(20),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SimpleText(
                "Email",
                bold: true,
              ),
              const AreaFormField(label: "Value"),
              const SizedBox(height: 50),
              const SimpleText("Password", bold: true),
              const AreaFormField(label: "Value"),
              const SizedBox(height: 15),
              AreaButton(
                label: "Login",
                onPressed: () {},
                color: Colors.black,
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
                  "I don't have an account",
                  onPressed: () {
                    context.push("/register");
                  },
                ),
              )
            ],
          ),
        ),
      )),
    );
  }
}
