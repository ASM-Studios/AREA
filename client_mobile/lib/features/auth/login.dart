import 'dart:io';
import 'package:client_mobile/widgets/button.dart';
import 'package:client_mobile/widgets/form_field.dart';
import 'package:client_mobile/widgets/sign_in_button.dart';
import 'package:client_mobile/widgets/simple_text.dart';
import 'package:flutter/material.dart';
import 'package:flutter_appauth/flutter_appauth.dart';
import 'package:flutter_web_auth/flutter_web_auth.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:oauth2/oauth2.dart' as oauth2;
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:oauth2_client/access_token_response.dart';
import 'package:oauth2_client/authorization_response.dart';
import 'package:oauth2_client/spotify_oauth2_client.dart';

class SpotifyOAuthApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Spotify OAuth2 Example',
      theme: ThemeData(primarySwatch: Colors.green),
      home: AuthScreen(),
    );
  }
}

class AuthScreen extends StatefulWidget {
  @override
  _AuthScreenState createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  final String callbackUrlScheme = 'my.area.app';
  String get redirectUrlMobile => '$callbackUrlScheme://callback';

  final String clientId = dotenv.env["VITE_SPOTIFY_CLIENT_ID"] ?? "";
  final appAuth = FlutterAppAuth();
  final String clientSecret = dotenv.env["VITE_SPOTIFY_CLIENT_SECRET"] ?? "";
  final String issuer = "https://accounts.spotify.com/";
  final Uri authorizationEndpoint =
      Uri.parse('https://accounts.spotify.com/authorize');
  final Uri tokenEndpoint = Uri.parse('https://accounts.spotify.com/api/token');
  final String redirectUrlWeb = "https://localhost:8081/auth/spotify/callback";
  final Uri redirectUri =
      Uri.parse('https://localhost:8081/auth/spotify/callback');
  oauth2.Client? client;

  Future<void> authenticateWithSpotify() async {
    try {
      final String spotifyUrl = 'https://accounts.spotify.com/authorize'
          '&client_id=$clientId'
          '&redirect_uri=$redirectUrlMobile';

      print("Authentification en cours ...");
      final result = await FlutterWebAuth.authenticate(
        url: redirectUrlMobile,
        callbackUrlScheme: callbackUrlScheme,
      );

      print("voici le résultat : ${result}");
    } catch (e) {
      print("erreur d'authentification : ${e}");
    }
  }

  Future<void> authenticateWithSpotifyOld() async {
    try {
      // print("client id : ${clientId}");
      // AccessTokenResponse? accessToken;
      // SpotifyOAuth2Client client = SpotifyOAuth2Client(
      //     redirectUri: redirectUrlMobile,
      //     customUriScheme: "my.area.app"
      //     );

      // var authResp =
      //     await client.requestAuthorization(clientId: clientId, customParams: {
      //   // 'show_dialog': 'true'
      // }, scopes: [
      //   'user-read-private',
      //   'user-read-playback-state',
      //   'user-modify-playback-state',
      //   'user-read-currently-playing',
      //   'user-read-email'
      // ]);
      // var authCode = authResp.code;

      // print("auth code : ${authCode}");

      final authorizationTokenRequest = AuthorizationTokenRequest(
          clientId, redirectUrlMobile,
          issuer: issuer,
          clientSecret: clientSecret,
          scopes: ["openid", "profile", "email", "offline_access"],
          additionalParameters: {'show_dialog': 'true'});

      final result =
          await appAuth.authorizeAndExchangeCode(authorizationTokenRequest);

      print("--------------------------------");
      print("");
      print("");
      print("Le code échangé est le suivant : ${result}");
      print("");
      print("");
      print("--------------------------------");

      return;
      // Start a small HTTP server to capture the callback
      // final server = await HttpServer.bind(InternetAddress.loopbackIPv4, 8080);
      // print("Listening on ${server.address}:${server.port}");

      // // Build the OAuth2 flow
      // final grant = oauth2.AuthorizationCodeGrant(
      //   clientId,
      //   authorizationEndpoint,
      //   tokenEndpoint,
      //   secret: clientSecret,
      //   httpClient: http.Client(),
      // );

      // // Generate the authorization URL
      // final authorizationUrl = grant.getAuthorizationUrl(redirectUri, scopes: [
      //   'user-read-email',
      //   'user-read-private',
      // ]);

      // // Open the browser for user login
      // print('Opening browser: $authorizationUrl');
      // await Process.run('open', [authorizationUrl.toString()]);

      // // Wait for the callback
      // final request = await server.first;

      // // Validate and close the server
      // final queryParameters = request.uri.queryParameters;
      // final code = queryParameters['code'];
      // final state = queryParameters['state'];
      // request.response
      //   ..statusCode = 200
      //   ..headers.set('Content-Type', ContentType.html.mimeType)
      //   ..write('You can now close this page.')
      //   ..close();
      // await server.close();

      // // Exchange the authorization code for tokens
      // if (code != null) {
      //   client = await grant.handleAuthorizationCode(code);
      //   setState(() {});
      //   print(
      //       'Authenticated successfully! Access token: ${client?.credentials.accessToken}');
      // }
    } catch (e) {
      print('Authentication failed: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: client == null
            ? Container(
                padding: const EdgeInsets.all(20),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SimpleText(
                      "Email",
                      bold: true,
                    ),
                    const AreaFormField(label: "Value"),
                    const SizedBox(height: 50),
                    const SimpleText("Password", bold: true),
                    const AreaFormField(label: "Value"),
                    const SizedBox(height: 15),
                    Align(
                      alignment: Alignment.center,
                      child: AreaButton(
                        label: "Register",
                        onPressed: () {},
                        color: Colors.black,
                      ),
                    ),
                    const SizedBox(height: 30),
                    Align(
                      alignment: Alignment.center,
                      child: SignInButton(
                        onPressed: () {
                          authenticateWithSpotifyOld();
                        },
                        label: "Sign in with Spotify",
                        icon: const FaIcon(
                          size: 34,
                          FontAwesomeIcons.spotify,
                          color: Colors.green,
                        ),
                      ),
                    )
                  ],
                ),
              )
            : Text(
                'Authenticated! Access token: ${client?.credentials.accessToken}'),
      ),
    );
  }
}
