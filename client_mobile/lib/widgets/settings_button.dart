import 'package:area/pages/settings/settings_page.dart';
import 'package:flutter/material.dart';

class SettingsButton extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () {
        Navigator.of(context).push(
          MaterialPageRoute(builder: (ctx) => SettingsPage()),
        );
      },
      child: const Icon(Icons.settings, size: 32, color: Colors.black),
    );
  }
}
