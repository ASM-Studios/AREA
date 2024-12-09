import 'package:aad_oauth/model/config.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter/material.dart';
import 'package:aad_oauth/aad_oauth.dart';
import '../../main.dart';
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
    try {
      final response = await http.get(
        Uri.parse('http://localhost:8080/auth/health'),
        headers: {'Authorization': 'Bearer $token'},
      );
      return response.statusCode == 200;
    } catch (e) {
      print('Erreur lors de la validation du token: $e');
      return false;
    }
  }

  static Future<bool> isUserLogin() async {
    final String? token = await secureStorage.read(key: 'bearer_token');
    if (token == null) return (false);
    if (!await validateBearerToken(token)) {
      await secureStorage.delete(
          key: 'bearer_token'); // delete expired token
      return (false);
    }
    return (true);
  }

  static Future<void> login(
      BuildContext context, Map<String, dynamic> jsonInfos) async {
        print("login");
  }
}
