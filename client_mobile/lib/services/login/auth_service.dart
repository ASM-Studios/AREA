import 'dart:convert';

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

  static const String baseUrl = "http://10.109.253.48:8080";

  static Future<bool> validateBearerToken(String token) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/auth/health'),
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
      await secureStorage.delete(key: 'bearer_token'); // delete expired token
      return (false);
    }
    return (true);
  }

  static Future<bool> login(
      BuildContext context, Map<String, dynamic> jsonInfos) async {

    try {
      // Afficher un indicateur de chargement si nécessaire
      print("Tentative de connexion...");

      // URL de l'API
      final url = Uri.parse('$baseUrl/auth/login');

      // Effectuer une requête POST
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(jsonInfos),
      );

      // Vérifier le statut de la réponse
      if (response.statusCode == 200) {
        // Extraire le token depuis la réponse JSON
        final responseData = jsonDecode(response.body);
        final String token = responseData['jwt'];

        // Stocker le token dans le secure storage
        await secureStorage.write(key: 'bearer_token', value: token);

        print("Connexion réussie et token sauvegardé !");
        return (true);
      } else {
        print(
            "Erreur de connexion : Code ${response.statusCode} - ${response.body}");
        return (false);
      }
    } catch (e) {
      print("Erreur lors de la connexion : $e");
      return (false);
    }
  }
}
