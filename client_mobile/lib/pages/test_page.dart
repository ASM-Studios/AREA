import 'package:area/services/oauth/oauth_service.dart';
import 'package:flutter/material.dart';

class TestPage extends StatefulWidget {
  const TestPage({super.key});

  @override
  State<TestPage> createState() => _TestPageState();
}

class _TestPageState extends State<TestPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: ElevatedButton(
          onPressed: () async {
            OAuthService.requestOAuth(context, "google");
          },
          child: const Text("google"),
        ),
      ),
    );
  }
}
