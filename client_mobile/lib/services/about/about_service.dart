import 'dart:convert';
import 'package:area/config/settings_config.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:area/data/service.dart';

class AboutService {
  static const FlutterSecureStorage secureStorage = FlutterSecureStorage();

  static Future<List<WorkflowService>> getAbout() async {
    String baseUrl = SettingsConfig.serverIp;
    final String? token = await secureStorage.read(key: 'bearer_token');
    final response = await http.get(
      Uri.parse('$baseUrl/about.json'),
      headers: {'Authorization': 'Bearer $token'},
    );
    if (response.statusCode == 200) {
      final jsonData = json.decode(response.body);

      return jsonData['server']['services'] != null ? (jsonData['server']['services'] as List)
          .map((service) => WorkflowService.fromJson(service))
          .toList() : [];
    } else {
      throw Exception('Failed to load services');
    }
  }
}
