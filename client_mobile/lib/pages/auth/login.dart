import 'package:area/services/login/auth_service.dart';
import 'package:area/tools/utils.dart';
import 'package:area/widgets/button.dart';
import 'package:area/widgets/clickable_text.dart';
import 'package:area/widgets/divider_with_text.dart';
import 'package:area/widgets/form_field.dart';
import 'package:area/widgets/oauth_buttons.dart';
import 'package:area/widgets/password_form_field.dart';
import 'package:area/widgets/simple_text.dart';
import 'package:flutter/material.dart';
import 'package:flutter_appauth/flutter_appauth.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final String callbackUrlScheme = 'com.asm_studios.area';
  String get spotifyRedirectUrlMobile => '$callbackUrlScheme://callback';
  bool isLoggingViaOauth = false;

  final String clientId = dotenv.env["VITE_SPOTIFY_CLIENT_ID"] ?? "";
  final appAuth = const FlutterAppAuth();

  final _formKey = GlobalKey<FormState>();

  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
          child: Container(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SimpleText("Email"),
                AreaFormField(
                  label: "you@example.com",
                  controller: emailController,
                  validator: (email) {
                    if (email == null || email.isEmpty) {
                      return "Please input your email.";
                    }
                    if (!Utils.isValidEmail(email)) {
                      return "Your email isn't correct.";
                    }
                    return (null);
                  },
                ),
                const SizedBox(height: 50),
                const SimpleText("Password"),
                PasswordFormField(
                  controller: passwordController,
                  validator: (password) {
                    if (password == null || password.isEmpty) {
                      return "Please input your password.";
                    }
                    return (null);
                  },
                  label: "********",
                ),
                const SizedBox(height: 15),
                AreaButton(
                  label: "Login",
                  onPressed: () async {
                    if (_formKey.currentState!.validate()) {
                      bool isLogin = await AuthService.login(
                          context,
                          LoginObject(
                                  email: emailController.text,
                                  password: passwordController.text)
                              .toJson());
                      if (isLogin) {
                        context.pushReplacement("/dashboard");
                      }
                    }
                  },
                  color: const Color(0XFF035a63),
                ),
                const SizedBox(height: 40),
                const DividerWithText(label: "Or Sign in with"),
                const SizedBox(height: 15),
                OAuthButtons(),
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
        ),
      )),
    );
  }
}
