import 'package:area/services/oauth/oauth_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';

class WebViewPage extends StatelessWidget {
  final String authUrl;
  final String serviceConfigRedirectUri;
  final String serviceId;
  final String codeVerifier;
  final bool signUp;

  const WebViewPage({
    Key? key,
    required this.authUrl,
    required this.serviceConfigRedirectUri,
    required this.serviceId,
    required this.codeVerifier,
    required this.signUp,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Connection"),
      ),
      body: InAppWebView(
        initialSettings: InAppWebViewSettings(
          userAgent:
              "Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Mobile Safari/537.36"),
        initialUrlRequest: URLRequest(url: WebUri(authUrl)),
        shouldOverrideUrlLoading:
            (InAppWebViewController controller, NavigationAction action) async {
          final url = action.request.url.toString();
          if (url.startsWith(serviceConfigRedirectUri)) {
            final code = Uri.parse(url).queryParameters['code'];
            if (code != null) {
              Navigator.pop(
                context,
                await OAuthService.exchangeCode(
                  code,
                  serviceConfigRedirectUri,
                  serviceId,
                  codeVerifier: codeVerifier,
                  signUp: signUp,
                ),
              );
            }
          }
          return NavigationActionPolicy.ALLOW;
        },
      ),
    );
  }
}
