import 'package:client_mobile/config/oauth_config.dart';
import 'package:client_mobile/services/discord/discord_auth_service.dart';
import 'package:client_mobile/services/google/google_auth_service.dart';
import 'package:client_mobile/services/microsoft/microsoft_auth_service.dart';
import 'package:client_mobile/services/spotify/spotify_auth_service.dart';
import 'package:client_mobile/tools/utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:go_router/go_router.dart';

class OAuthService {
  const OAuthService();

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

  static Future<bool> showWebView(BuildContext context, String serviceId) async {
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
    return await showDialog<bool>(
          context: context,
          builder: (context) => AlertDialog(
            content: Container(
              // height: 500,
              // width: 400,
              child: InAppWebView(
                initialUrlRequest: URLRequest(url: WebUri(authUrl)),
                onLoadStart:
                    (InAppWebViewController controller, WebUri? url) async {
                  // Si l'URL contient le code d'autorisation, on l'extrait
                  if (url.toString().startsWith(serviceConfig.redirectUri)) {
                    final code = Uri.parse(url.toString()).queryParameters['code'];
                    if (code != null) {
                      print("Code d'autorisation reçu : $code");
                      Navigator.pop(
                          context, true); // Ferme le dialog et renvoie `true`
                      // return await _fetchSpotifyAccessToken(
                          // code); // Échange le code contre un token
                    }
                  }
                },
                // onLoadError: (controller, url, code, message) {
                //   print("Erreur de chargement de l'URL : $message");
                // },
                shouldOverrideUrlLoading: (InAppWebViewController controller,
                    NavigationAction action) async {
                  final url = action.request.url.toString();
                  if (url.startsWith(serviceConfig.redirectUri)) {
                    // Si l'URL de redirection est détectée, on extrait le code
                    final code = Uri.parse(url).queryParameters['code'];
                    if (code != null) {
                      print("Code d'autorisation reçu : $code");
                      Navigator.pop(
                          context, true); // Ferme le dialog et renvoie `true`
                      // return await _fetchSpotifyAccessToken(
                      //     code); // Échange le code contre un token
                    }
                  }
                  return NavigationActionPolicy.ALLOW;
                },
              ),
            ),
          ),
        ) ??
        false;
  }
}
