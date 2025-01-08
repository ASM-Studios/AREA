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
    String? bearerToken = await secureStorage.read(key: "bearer_token");
    print("bearer token : $bearerToken");
    print("token microsoft : $token");
    setState(() {
      microsoftToken = token;
    });
  }

  @override
  Widget build(BuildContext context) {
    return const Placeholder();
  }
}
