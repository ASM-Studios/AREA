import 'package:flutter_dotenv/flutter_dotenv.dart';

class SettingsConfig {
  const SettingsConfig();

  static String serverIp = dotenv.env["BACKEND_BASE_URL"] ?? "http://127.0.0.1:8080";

  static void setServerIp(String newAdress) {
    serverIp = newAdress;
  }
}