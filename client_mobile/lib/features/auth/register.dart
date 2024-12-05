// import 'dart:io';
import 'package:client_mobile/services/microsoft/microsoft_auth_service.dart';
import 'package:client_mobile/widgets/button.dart';
import 'package:client_mobile/widgets/clickable_text.dart';
import 'package:client_mobile/widgets/form_field.dart';
import 'package:client_mobile/widgets/sign_in_button.dart';
import 'package:client_mobile/widgets/simple_text.dart';
import 'package:flutter/material.dart';
import 'package:flutter_appauth/flutter_appauth.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class RegisterPage extends StatefulWidget {
  @override
  _RegisterPageState createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final String callbackUrlScheme = 'my.area.app';
  String get spotifyRedirectUrlMobile => '$callbackUrlScheme://callback';

  final String clientId = dotenv.env["VITE_SPOTIFY_CLIENT_ID"] ?? "";
  final appAuth = const FlutterAppAuth();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
          child: Container(
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
      )),
    );
  }
}
