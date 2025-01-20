import 'package:area/config/settings_config.dart';
import 'package:area/config/translation_config.dart';
import 'package:area/services/login/auth_service.dart';
import 'package:area/tools/utils.dart';
import 'package:area/widgets/button.dart';
import 'package:area/widgets/clickable_text.dart';
import 'package:area/widgets/divider_with_text.dart';
import 'package:area/widgets/form_field.dart';
import 'package:area/widgets/oauth_buttons.dart';
import 'package:area/widgets/password_form_field.dart';
import 'package:area/widgets/settings_button.dart';
import 'package:area/widgets/simple_text.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  bool isLoggingViaOauth = false;

  final _formKey = GlobalKey<FormState>();

  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
          child: Container(
        padding: const EdgeInsets.fromLTRB(10, 0, 10, 20),
        child: Form(
          key: _formKey,
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.fromLTRB(0, 0, 5, 15),
                  child: Align(
                      alignment: Alignment.topRight, child: SettingsButton()),
                ),
                SimpleText(TranslationConfig.translate("email", language: SettingsConfig.language)),
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
                SimpleText(TranslationConfig.translate("password", language: SettingsConfig.language)),
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
                  label: TranslationConfig.translate("login", language: SettingsConfig.language),
                  onPressed: () async {
                    if (_formKey.currentState!.validate()) {
                      bool isLogin = await AuthService.login(
                          context,
                          LoginObject(
                                  email: emailController.text,
                                  password: passwordController.text)
                              .toJson());
                      if (isLogin) {
                        context.pushReplacement("/workflow/list");
                      }
                    }
                  },
                  color: const Color(0XFF035a63),
                ),
                const SizedBox(height: 40),
                DividerWithText(label: TranslationConfig.translate("divider_login", language: SettingsConfig.language)),
                const SizedBox(height: 15),
                OAuthButtons(),
                const SizedBox(height: 5),
                Align(
                  alignment: Alignment.center,
                  child: SmallClickableText(
                    TranslationConfig.translate("no_account", language: SettingsConfig.language),
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
