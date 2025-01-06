import 'dart:convert';

import 'package:client_mobile/config/oauth_config.dart';
import 'package:client_mobile/services/discord/discord_auth_service.dart';
import 'package:client_mobile/services/google/google_auth_service.dart';
import 'package:client_mobile/services/microsoft/microsoft_auth_service.dart';
import 'package:client_mobile/services/spotify/spotify_auth_service.dart';
import 'package:client_mobile/tools/utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:go_router/go_router.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';


class OAuthService {
  const OAuthService();

  static const FlutterSecureStorage secureStorage = FlutterSecureStorage();

  static void handleOAuth(BuildContext context, String serviceId,
      {required bool signUp}) async {
    bool isRegistered;
    switch (serviceId) {
      case "microsoft":
        isRegistered = await MicrosoftAuthService.auth(context, signUp: true);
        break;
      case "google":
        isRegistered = await GoogleAuthService.auth(context, signUp: true);
        break;
      case "spotify":
        isRegistered = await SpotifyAuthService.auth(context, signUp: true);
        break;
      case "discord":
        isRegistered = await DiscordAuthService.auth(context, signUp: true);
        break;
      default:
        isRegistered = false;
        break;
    }

    if (!context.mounted) {
      return;
    }

    if (isRegistered) {
      context.pushReplacement("/dashboard");
    }
  }

  static Future<bool> exchangeCode(String code, String redirectUri, String serviceId, {String ?codeVerifier, bool signUp = false}) async
  {
    String baseUrl = dotenv.env["BACKEND_BASE_URL"] ?? "https://localhost:8080";
    final Uri endpoint = signUp ? Uri.parse('$baseUrl/oauth/$serviceId') : Uri.parse('$baseUrl/oauth/bind/$serviceId');

    final response = await http.post(
      endpoint,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        "code": code,
        "redirect_uri": redirectUri,
        if (codeVerifier != null) "code_verifier": codeVerifier
      })
    );

    print("réponse recu après echange du code avec le back : ${jsonDecode(response.body)}");

    if (signUp) {
      final responseData = jsonDecode(response.body);
      await secureStorage.write(
          key: 'bearer_token', value: responseData["jwt"]);
    }

    return (response.statusCode == 200);
  }

  static Future<bool> requestOAuth(BuildContext context, String serviceId, {bool signUp = false}) async {
    OAuthServiceConfig? serviceConfig = OAuthConfigManager.getServiceConfig(serviceId);

    if (serviceConfig == null)
      return false;

    String? codeVerifier = serviceConfig.pkce ? Utils.generateCodeVerifier() : "";
    
    final String authUrl = Uri.https(serviceConfig.authority, serviceConfig.path, {
      "response_type": "code",
      "client_id": serviceConfig.clientId,
      "scope": serviceConfig.scope,
      "redirect_uri": serviceConfig.redirectUri,
      if (serviceConfig.pkce) "code_challenge": Utils.generateCodeChallenge(codeVerifier),
      if (serviceConfig.pkce) "code_challenge_method": "S256"
    }).toString();
    // Crée une page WebView dans un Dialog
    final bool hasExchangedCorrectly = await showDialog<bool>(
          context: context,
          builder: (context) => AlertDialog(
            content: Container(
              // height: 500,
              // width: 400,
              child: InAppWebView(
                initialUrlRequest: URLRequest(url: WebUri(authUrl)),
                // onLoadError: (controller, url, code, message) {
                //   print("Erreur de chargement de l'URL : $message");
                // },
                shouldOverrideUrlLoading: (InAppWebViewController controller,
                    NavigationAction action) async {
                  final url = action.request.url.toString();
                  if (url.startsWith(serviceConfig.redirectUri)) {
                    final code = Uri.parse(url).queryParameters['code'];
                    if (code != null) {
                      print("Code d'autorisation reçu : $code");
                      Navigator.pop(
                          context, await exchangeCode(code, serviceConfig.redirectUri, serviceId, codeVerifier: codeVerifier, signUp: signUp));
                      // bool hasExchangedCorrectly = await exchangeCode(code, serviceConfig.redirectUri, serviceId, codeVerifier: codeVerifier, signUp: signUp);
// 
                      // if (hasExchangedCorrectly)
                        // context.pushReplacement("/dashboard");
                    }
                  }
                  return NavigationActionPolicy.ALLOW;
                },
              ),
            ),
          ),
        ) ??
        false;
    if (hasExchangedCorrectly) {
      ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text("Connexion effectuée avec succès !"),
              backgroundColor: Colors.black,
            ),
          );
      context.pushReplacement("/dashboard");
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text("Erreur lors de la connexion "),
              backgroundColor: Colors.red,
            ),
          );
    }
    return (hasExchangedCorrectly);
  }
}
