import 'package:area/config/settings_config.dart';
import 'package:area/config/translation_config.dart';
import 'package:area/pages/settings/settings_page.dart';
import 'package:area/services/login/auth_service.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class ProfileButton extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return PopupMenuButton<String>(
      onSelected: (value) async {
        if (value == 'profile') {
          context.push("/profile");
        } else if (value == 'settings') {
          Navigator.of(context)
              .push(MaterialPageRoute(builder: (ctx) => SettingsPage()));
        } else if (value == 'disconnect') {
          bool hasLogout = await AuthService.logout();
          if (hasLogout) context.pushReplacement("/login");
        }
      },
      itemBuilder: (BuildContext context) {
        return [
          PopupMenuItem<String>(
            value: 'profile',
            child: Text(TranslationConfig.translate(
              "profile",
              language: SettingsConfig.language,
            )),
          ),
          PopupMenuItem<String>(
            value: 'settings',
            child: Text(TranslationConfig.translate(
              "settings",
              language: SettingsConfig.language,
            )),
          ),
          PopupMenuItem<String>(
            value: 'disconnect',
            child: Text(
                TranslationConfig.translate(
                  "disconnect",
                  language: SettingsConfig.language,
                ),
                style: TextStyle(color: Colors.red)),
          ),
        ];
      },
      icon: const Icon(Icons.person, size: 32, color: Colors.black),
    );
  }
}
