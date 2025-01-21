import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SettingsConfig {
  const SettingsConfig();

  static String serverIp = dotenv.env["BACKEND_BASE_URL"] ?? "http://127.0.0.1:8080";
  static const FlutterSecureStorage secureStorage = FlutterSecureStorage();
  static String language = "EN";


  static void initLanguage() async {
    language = await secureStorage.read(key: 'language') ?? "EN";
  }

  static void setServerIp(String newAdress) {
    serverIp = newAdress;
  }

  static void setLanguage(String newLanguage) async {
    await secureStorage.write(key: "language", value: newLanguage);
    language = newLanguage;
  }
}