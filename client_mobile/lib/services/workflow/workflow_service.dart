import 'dart:convert';
import 'package:client_mobile/data/workflow.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;

class UpdateWorkflowService {
  static const FlutterSecureStorage secureStorage = FlutterSecureStorage();

  static String baseUrl =
      dotenv.env["BACKEND_BASE_URL"] ?? "http://127.0.0.1:8080";

  static Future<bool> createWorkflow(Workflow workflow) async {
    final String? token = await secureStorage.read(key: 'bearer_token');

    print("bearer token : $token");
    final response = await http.post(Uri.parse('$baseUrl/workflow/create'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json'
        },
        body: jsonEncode(workflow.toJson()));

    return (response.statusCode == 200);
  }

  static Future<List<Workflow>> getWorkflowList() async {
    final String? token = await secureStorage.read(key: 'bearer_token');
    print("voici ton bearer : $token");

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
    final String? token = await secureStorage.read(key: 'bearer_token');

    final response = await http.delete(
      Uri.parse('$baseUrl/workflow/delete/$id'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json'
      },
    );

    return (response.statusCode == 200);
  }
}
