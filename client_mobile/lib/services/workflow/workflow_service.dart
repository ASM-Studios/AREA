import 'dart:convert';
import 'package:area/config/settings_config.dart';
import 'package:area/data/workflow.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;

class UpdateWorkflowService {
  static const FlutterSecureStorage secureStorage = FlutterSecureStorage();

  static Future<bool> createWorkflow(Workflow workflow) async {
    String baseUrl = SettingsConfig.serverIp;
    final String? token = await secureStorage.read(key: 'bearer_token');

    final response = await http.post(Uri.parse('$baseUrl/workflow/create'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json'
        },
        body: jsonEncode(workflow.toJson()));

    return (response.statusCode == 200);
  }

  static Future<List<Workflow>> getWorkflowList() async {
    String baseUrl = SettingsConfig.serverIp;
    final String? token = await secureStorage.read(key: 'bearer_token');

    final response = await http.get(
      Uri.parse('$baseUrl/workflow/list'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json'
      },
    );

    if (response.statusCode == 200) {
      final jsonData = json.decode(response.body);

      return (jsonData['workflows'] as List)
          .map((service) => Workflow.fromJson(service))
          .toList();
    } else {
      throw Exception("Unable to load workflows");
    }
  }

  static Future<bool> deleteWorkflow(int id) async {
    String baseUrl = SettingsConfig.serverIp;
    final String? token = await secureStorage.read(key: 'bearer_token');

    try {
      final response = await http.delete(
        Uri.parse('$baseUrl/workflow/delete/$id'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json'
        },
      );
      return (response.statusCode == 200);
    } catch (e) {
      return (false);
    }
  }
}
