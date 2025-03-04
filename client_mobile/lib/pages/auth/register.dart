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

class RegisterPage extends StatefulWidget {
  @override
  _RegisterPageState createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  bool isLoggingViaOauth = false;

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
        padding: const EdgeInsets.fromLTRB(10, 45, 10, 20),
        child: Form(
          key: _formKey,
          child: SingleChildScrollView(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                 Padding(
                  padding: const EdgeInsets.fromLTRB(0, 0, 5, 15),
                  child: Align(
                      alignment: Alignment.topRight, child: SettingsButton()),
                ),
                SimpleText(TranslationConfig.translate("username", language: SettingsConfig.language)),
                AreaFormField(
                    label: "username",
                    controller: userController,
                    validator: (user) {
                      if (user == null || user.isEmpty) {
                        return "Please input your username.";
                      }
                      return (null);
                    }),
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
                  label: "********",
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
                SimpleText(TranslationConfig.translate("confirm_password", language: SettingsConfig.language)),
                PasswordFormField(
                  label: "********",
                  controller: confirmPasswordController,
                  validator: (password) {
                    if (password != passwordController.text) {
                      return "Your password doesn't match.";
                    }
                    return (null);
                  },
                ),
                const SizedBox(height: 15),
                Align(
                  alignment: Alignment.center,
                  child: AreaButton(
                      label: TranslationConfig.translate("register", language: SettingsConfig.language),
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
                            context.pushReplacement("/workflow/list");
                          }
                        }
                      },
                      color: const Color(0XFF035a63)),
                ),
                const SizedBox(height: 40),
                DividerWithText(label: TranslationConfig.translate("divider_register", language: SettingsConfig.language)),
                const SizedBox(height: 15),
                OAuthButtons(),
                const SizedBox(height: 5),
                Align(
                  alignment: Alignment.center,
                  child: SmallClickableText(
                    TranslationConfig.translate("have_account", language: SettingsConfig.language),
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
