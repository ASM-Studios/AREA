import 'package:client_mobile/services/login/auth_service.dart';
import 'package:client_mobile/services/microsoft/microsoft_auth_service.dart';
import 'package:client_mobile/tools/utils.dart';
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

  final _formKey = GlobalKey<FormState>();

  final TextEditingController userController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController confirmPasswordController =
      TextEditingController();

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
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SimpleText(
                  "Username",
                  bold: true,
                ),
                AreaFormField(
                    label: "Value",
                    controller: userController,
                    validator: (user) {
                      if (user == null || user.isEmpty)
                        return "Please input your username.";
                      return (null);
                    }),
                const SimpleText(
                  "Email",
                  bold: true,
                ),
                AreaFormField(
                  label: "Value",
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
                const SizedBox(height: 25),
                const SimpleText("Password", bold: true),
                AreaFormField(
                  label: "Value",
                  controller: passwordController,
                  validator: (password) {
                    if (password == null || password.isEmpty) {
                      return "Please input your password.";
                    }
                    String pwdError = Utils.isValidPassword(password);
                    if (pwdError.isNotEmpty) return (pwdError);
                    return (null);
                  },
                ),
                const SizedBox(height: 15),
                const SimpleText("Confirm password", bold: true),
                AreaFormField(
                  label: "Value",
                  controller: confirmPasswordController,
                  validator: (password) {
                    if (password == null || password.isEmpty) {
                      return "Please confirm your password.";
                    }
                    if (password != passwordController.text)
                      return "Your password doesn't match.";
                    return (null);
                  },
                ),
                const SizedBox(height: 15),
                Align(
                  alignment: Alignment.center,
                  child: AreaButton(
                    label: "Register",
                    onPressed: () async {
                      if (_formKey.currentState!.validate()) {
                        bool isRegistered = await AuthService.register(
                            context,
                            RegisterObject(
                                    email: emailController.text,
                                    password: passwordController.text,
                                    username: userController.text)
                                .toJson());
                        if (isRegistered) {
                          context.pushReplacement("/dashboard");
                        }
                      }
                    },
                    color: Colors.black,
                  ),
                ),
                const SizedBox(height: 30),
                Align(
                  alignment: Alignment.center,
                  child: SignInButton(
                    onPressed: () async {
                      bool isRegistered = await MicrosoftAuthService.auth(
                          context,
                          signUp: true);
                      if (isRegistered) {
                        if (context.mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text("Microsoft link avec succès !"),
                              backgroundColor: Colors.black,
                            ),
                          );
                          context.pushReplacement("/dashboard");
                        }
                      } else {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text("Microsoft authentification failed."),
                            backgroundColor: Colors.red,
                          ),
                        );
                      }
                    },
                    label: "Sign in with Microsoft",
                    image: Image.asset(
                      "assets/images/microsoft.png",
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
        ),
      )),
    );
  }
}
