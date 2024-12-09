import 'package:client_mobile/pages/auth/login.dart';
import 'package:client_mobile/pages/auth/register.dart';
import 'package:client_mobile/pages/dashboard/dashboard.dart';
import 'package:client_mobile/pages/home/home.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:go_router/go_router.dart';

final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();
Future<void> main() async {
  await dotenv.load(fileName: ".env.mobile");

  final GoRouter router = GoRouter(
    navigatorKey: navigatorKey,
    routes: [
      GoRoute(
        path: '/',
        builder: (context, state) => HomePage(),
      ),
      GoRoute(
        path: '/login',
        builder: (context, state) => LoginPage(),
      ),
      GoRoute(
        path: '/register',
        builder: (context, state) => RegisterPage(),
      ),
      GoRoute(
        path: '/dashboard',
        builder: (context, state) => DashboardPage(),
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
