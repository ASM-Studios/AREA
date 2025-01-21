import 'dart:convert';

import 'package:area/config/oauth_config.dart';
import 'package:area/config/settings_config.dart';
import 'package:area/config/translation_config.dart';
import 'package:area/pages/webview/webview_page.dart';
import 'package:area/tools/utils.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class OAuthService {
  const OAuthService();

  static const FlutterSecureStorage secureStorage = FlutterSecureStorage();

  static Future<bool> exchangeCode(
      String code, String redirectUri, String serviceId,
      {String? codeVerifier, bool signUp = false}) async {
    String baseUrl = SettingsConfig.serverIp;
    final Uri endpoint = signUp
        ? Uri.parse('$baseUrl/oauth/$serviceId')
        : Uri.parse('$baseUrl/oauth/bind/$serviceId');
    final String? bearerToken = await secureStorage.read(key: "bearer_token");

    final response = await http.post(endpoint,
        headers: {
          'Content-Type': 'application/json',
          if (!signUp) 'Authorization': 'Bearer $bearerToken'
        },
        body: jsonEncode({
          "code": code,
          "redirect_uri": redirectUri,
          if (codeVerifier != null) "code_verifier": codeVerifier
        }));

    if (signUp) {
      final responseData = jsonDecode(response.body);
      await secureStorage.write(
          key: 'bearer_token', value: responseData["jwt"]);
    }

    return (response.statusCode == 200);
  }

  static Future<bool> requestOAuth(BuildContext context, String serviceId,
      {bool signUp = false}) async {
    OAuthServiceConfig? serviceConfig =
        OAuthConfigManager.getServiceConfig(serviceId);

    if (serviceConfig == null) return false;

    String? codeVerifier =
        serviceConfig.pkce ? Utils.generateCodeVerifier() : "";

    final String authUrl =
        Uri.https(serviceConfig.authority, serviceConfig.path, {
      "response_type": "code",
      "client_id": serviceConfig.clientId,
      "scope": serviceConfig.scope,
      "redirect_uri": serviceConfig.redirectUri,
      if (serviceConfig.pkce)
        "code_challenge": Utils.generateCodeChallenge(codeVerifier),
      if (serviceConfig.pkce) "code_challenge_method": "S256"
    }).toString();

    final hasExchangedCorrectly = await Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => WebViewPage(
          authUrl: authUrl,
          serviceConfigRedirectUri: serviceConfig.redirectUri,
          serviceId: serviceId,
          codeVerifier: codeVerifier,
          signUp: signUp,
        ),
      ),
    );
    if (hasExchangedCorrectly) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(TranslationConfig.translate(
              "oauth_success",
              language: SettingsConfig.language,
            )),
          backgroundColor: Colors.black,
        ),
      );
      context.pushReplacement("/workflow/list");
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(TranslationConfig.translate(
              "oauth_error",
              language: SettingsConfig.language,
            )),
          backgroundColor: Colors.red,
        ),
      );
    }
    return (hasExchangedCorrectly);
  }
}
