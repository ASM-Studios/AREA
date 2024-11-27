import 'package:client_mobile/features/auth/login.dart';
import 'package:client_mobile/features/auth/register.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:go_router/go_router.dart';

Future<void> main() async {
  await dotenv.load(fileName: ".env");

  final GoRouter router = GoRouter(
    routes: [
      GoRoute(
        path: '/',
        builder: (context, state) => LoginPage(),
      ),
      GoRoute(
        path: '/register',
        builder: (context, state) => RegisterPage(),
      ),
    ],
  );

  runApp(
    MaterialApp.router(
      title: 'Area PoC Flutter',
      theme: ThemeData(primarySwatch: Colors.green),
      routerConfig: router,
    ),
  );
}
