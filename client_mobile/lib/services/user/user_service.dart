import 'dart:convert';
import 'package:area/config/settings_config.dart';
import 'package:area/data/user_infos.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;

class UserService {
  static const FlutterSecureStorage secureStorage = FlutterSecureStorage();

  static Future<UserInfos> getUserInfos() async {
    String baseUrl = SettingsConfig.serverIp;
    final String? token = await secureStorage.read(key: 'bearer_token');
    final response = await http.get(
      Uri.parse('$baseUrl/user/me'),
      headers: {'Authorization': 'Bearer $token'},
    );
    if (response.statusCode == 200) {
      final jsonData = json.decode(response.body);

      return UserInfos(
          username: jsonData["user"]["username"],
          mail: jsonData["user"]["email"],
          services: jsonData['user']['services'] != null ? (jsonData['user']['services'] as List)
              .map((service) => service["name"] as String)
              .toList() : []);
    } else {
      throw Exception('Failed to load services');
    }
  }
}
