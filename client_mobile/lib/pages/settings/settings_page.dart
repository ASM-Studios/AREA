import 'package:area/config/settings_config.dart';
import 'package:area/config/translation_config.dart';
import 'package:area/widgets/form_field.dart';
import 'package:area/widgets/simple_text.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:restart_app/restart_app.dart';

class SettingsPage extends StatelessWidget {
  SettingsPage({super.key});

  final Map<String, String> languageOptions = {
    'FR': TranslationConfig.translate(
      "france",
      language: SettingsConfig.language,
    ),
    'EN': TranslationConfig.translate(
      "england",
      language: SettingsConfig.language,
    ),
    'ES': TranslationConfig.translate(
      "spain",
      language: SettingsConfig.language,
    ),
    'PI': TranslationConfig.translate(
      "pirate",
      language: SettingsConfig.language,
    ),
  };

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          title: Text(
        style: const TextStyle(
            color: Colors.black, fontSize: 24, fontWeight: FontWeight.bold),
        TranslationConfig.translate(
          "settings",
          language: SettingsConfig.language,
        ),
      )),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(10.0),
          child: Column(
            children: [
              SimpleText(
                TranslationConfig.translate(
                  "settings_ip",
                  language: SettingsConfig.language,
                ),
                textAlign: TextAlign.left,
              ),
              const SizedBox(height: 5),
              AreaFormField(
                label: TranslationConfig.translate(
                  "settings_ip",
                  language: SettingsConfig.language,
                ),
                initialValue: SettingsConfig.serverIp,
                onChanged: (value) {
                  if (value.isEmpty) {
                    SettingsConfig.setServerIp(dotenv.env["BACKEND_BASE_URL"] ??
                        "http://127.0.0.1:8080");
                  } else {
                    SettingsConfig.setServerIp(value);
                  }
                },
              ),
              const SizedBox(height: 10),
              DropdownButtonFormField<String>(
                value: SettingsConfig.language,
                decoration: InputDecoration(
                  labelText: TranslationConfig.translate(
                    "language",
                    language: SettingsConfig.language,
                  ),
                  border: OutlineInputBorder(),
                ),
                items: languageOptions.entries.map((entry) {
                  return DropdownMenuItem<String>(
                    value: entry.key,
                    child: Text(entry.value),
                  );
                }).toList(),
                onChanged: (String? newValue) {
                  if (newValue != null) {
                    SettingsConfig.setLanguage(newValue);
                    Restart.restartApp(); // restart
                  }
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
