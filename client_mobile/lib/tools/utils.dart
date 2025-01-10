import 'dart:convert';
import 'dart:math';
import 'package:crypto/crypto.dart';

class Utils {
  static bool isValidEmail(String email) {
    final emailRegex =
        RegExp(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');
    return emailRegex.hasMatch(email);
  }

  static String isValidPassword(String password) {
    String error = "";

    if (password.length < 8) {
      error += "Your password must be at least 8 characters.\n";
    }
    if (!RegExp(r'[a-zA-Z]').hasMatch(password)) {
      error += "Password must contain at least one letter.\n";
    }
    if (!RegExp(r'\d').hasMatch(password)) {
      error += "Password must contain at least one number.\n";
    }
    if (!RegExp(r'[!@#$%^&*(),.?":{}|<>]').hasMatch(password)) {
      error += "Password must contain at least one special character.\n";
    }
    return (error);
  }

  static String generateCodeVerifier() {
    final random = Random.secure();
    const String pattern = r'[A-Za-z0-9\-._~]';
    return List.generate(128, (i) {
      String char;
      do {
        char = String.fromCharCode(random.nextInt(127));
      } while (!RegExp(pattern).hasMatch(char));
      return (char);
    }).join();
  }

  static String generateCodeChallenge(String codeVerifier) {
    var bytes = ascii.encode(codeVerifier);
    var digest = sha256.convert(bytes);
    String codeChallenge = base64Url
        .encode(digest.bytes)
        .replaceAll("=", "")
        .replaceAll("+", "-")
        .replaceAll("/", "_");
    return codeChallenge;
  }
}
