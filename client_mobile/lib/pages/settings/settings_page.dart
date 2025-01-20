import 'package:area/config/settings_config.dart';
import 'package:area/widgets/form_field.dart';
import 'package:area/widgets/simple_text.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class SettingsPage extends StatelessWidget {
  SettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          title: Text(
        style: const TextStyle(
            color: Colors.black, fontSize: 24, fontWeight: FontWeight.bold),
        "Settings",
      )),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(10.0),
          child: Column(
            children: [
              SimpleText(
                "Server IP Address",
                textAlign: TextAlign.left,
              ),
              const SizedBox(height: 5),
              AreaFormField(
                label: "Server IP Address",
                initialValue: SettingsConfig.serverIp,
                onChanged: (value) {
                  if (value.isEmpty) {
                    SettingsConfig.setServerIp(dotenv.env["BACKEND_BASE_URL"] ??
                        "http://127.0.0.1:8080");
                  } else {
                    SettingsConfig.setServerIp(value);
                  }
                },
              )
            ],
          ),
        ),
      ),
    );
  }
}
