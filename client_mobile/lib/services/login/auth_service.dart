import 'dart:convert';

import 'package:area/config/settings_config.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class LoginObject {
  final String email;
  final String password;

  LoginObject({
    required this.email,
    required this.password,
  });

  Map<String, dynamic> toJson() {
    return {
      'email': email,
      'password': password,
    };
  }

  factory LoginObject.fromJson(Map<String, dynamic> json) {
    return LoginObject(
      email: json['email'] as String,
      password: json['password'] as String,
    );
  }
}

class RegisterObject {
  final String email;
  final String password;
  final String username;

  RegisterObject(
      {required this.email, required this.password, required this.username});

  Map<String, dynamic> toJson() {
    return {
      'email': email,
      'password': password,
      'username': username,
    };
  }

  factory RegisterObject.fromJson(Map<String, dynamic> json) {
    return RegisterObject(
      email: json['email'] as String,
      password: json['password'] as String,
      username: json['username'] as String,
    );
  }
}

class AuthService {
  static const FlutterSecureStorage secureStorage = FlutterSecureStorage();

  static Future<bool> validateBearerToken(String token) async {
    String baseUrl = SettingsConfig.serverIp;
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/auth/health'),
        headers: {'Authorization': 'Bearer $token'},
      ).timeout(Duration(seconds: 5));
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }

  static Future<bool> isUserLogin() async {
    final String? token = await secureStorage.read(key: 'bearer_token');
    if (token == null) return (false);
    if (!await validateBearerToken(token)) {
      await secureStorage.delete(key: 'bearer_token'); // delete expired token
      return (false);
    }
    return (true);
  }

  static Future<bool> login(
      BuildContext context, Map<String, dynamic> jsonInfos) async {
    String baseUrl = SettingsConfig.serverIp;
    try {
      final url = Uri.parse('$baseUrl/auth/login');

      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(jsonInfos),
      );

      if (response.statusCode == 200) {
        final responseData = jsonDecode(response.body);
        final String token = responseData['jwt'];

        await secureStorage.write(key: 'bearer_token', value: token);

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Login successfully !"),
            backgroundColor: Colors.black,
          ),
        );
        return (true);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
                "Erreur de connexion : Code ${response.statusCode} - ${response.body}"),
            backgroundColor: Colors.red,
          ),
        );
        return (false);
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Login error : $e"),
          backgroundColor: Colors.red,
        ),
      );
      return (false);
    }
  }

  static Future<bool> register(
      BuildContext context, Map<String, dynamic> jsonInfos) async {
    String baseUrl = SettingsConfig.serverIp;
    try {
      final url = Uri.parse('$baseUrl/auth/register');

      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(jsonInfos),
      );

      if (response.statusCode == 200) {
        final responseData = jsonDecode(response.body);
        final String token = responseData['jwt'];

        await secureStorage.write(key: 'bearer_token', value: token);

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text("Register successfully !"),
            backgroundColor: Colors.black,
          ),
        );
        return (true);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text("Unauthrorized to process."),
            backgroundColor: Colors.red,
          ),
        );
        return (false);
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Register error: $e"),
          backgroundColor: Colors.red,
        ),
      );
      return (false);
    }
  }

  static Future<bool> logout() async {
    bool isLogin = await secureStorage.read(key: "bearer_token") != null;

    if (isLogin) {
      await secureStorage.delete(key: "bearer_token");
      return (true);
    }
    return (false);
  }
}
