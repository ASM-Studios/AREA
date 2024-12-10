import 'package:client_mobile/services/microsoft/microsoft_auth_service.dart';
import 'package:client_mobile/widgets/sign_in_button.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ServiceConnectionPage extends StatefulWidget {
  const ServiceConnectionPage({super.key});

  @override
  State<ServiceConnectionPage> createState() => _ServiceConnectionPageState();
}

class _ServiceConnectionPageState extends State<ServiceConnectionPage> {
  FlutterSecureStorage secureStorage = const FlutterSecureStorage();

  String? microsoftToken;

  @override
  void initState() {
    super.initState();
    _loadMicrosoftToken();
  }

  Future<void> _loadMicrosoftToken() async {
    String? token = await secureStorage.read(key: "microsoft_access_token");
    print("token microsoft : $token");
    setState(() {
      microsoftToken = token;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          if (microsoftToken == null)
            SignInButton(
              onPressed: () async {
                MicrosoftAuthService.auth(context);
                await _loadMicrosoftToken();
              },
              label: "Link with Microsoft",
              image: Image.asset(
                "assets/images/microsoft.png",
                width: 40,
                height: 30,
              ),
            )
          else
            GestureDetector(
              onTap: () async {
                await secureStorage.delete(key: "microsoft_access_token");
                setState(() {
                  microsoftToken = null;
                });
              },
              child: const Text(
                "✅ Microsoft is already linked",
                style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.green),
              ),
            ),
          SignInButton(
            onPressed: () {},
            label: "Link with Spotify",
            image: Image.asset(
              "assets/images/spotify_green.png",
              width: 40,
              height: 30,
            ),
          ),
          SignInButton(
            onPressed: () {},
            label: "Link with Google",
            image: Image.asset(
              "assets/images/google.png",
              width: 40,
              height: 30,
            ),
          ),
          SignInButton(
            onPressed: () {},
            label: "Link with Discord",
            image: Image.asset(
              "assets/images/discord.png",
              width: 40,
              height: 30,
            ),
          ),
        ],
      ),
    );
  }
}
