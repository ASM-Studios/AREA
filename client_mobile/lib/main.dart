import 'package:area/config/settings_config.dart';
import 'package:area/pages/auth/login.dart';
import 'package:area/pages/auth/register.dart';
import 'package:area/pages/dashboard/workflow.dart';
import 'package:area/pages/dashboard/workflow_list_page.dart';
import 'package:area/pages/home/home.dart';
import 'package:area/pages/profile/profile_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:go_router/go_router.dart';

final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();
Future<void> main() async {
  await dotenv.load(fileName: ".env");
  SettingsConfig.initLanguage();

  final GoRouter router = GoRouter(
    navigatorKey: navigatorKey,
    routes: [
      GoRoute(
        path: '/',
        name: 'home',
        builder: (context, state) => const HomePage(),
      ),
      GoRoute(
        path: '/login',
        name: 'login',
        builder: (context, state) => const LoginPage(),
      ),
      GoRoute(
        path: '/register',
        name: 'register',
        builder: (context, state) => RegisterPage(),
      ),
      GoRoute(
        path: '/workflow/list',
        name: 'workflowList',
        builder: (context, state) => const WorkflowListPage(),
      ),
      GoRoute(
        path: '/workflow/create',
        name: 'workflowCreation',
        builder: (context, state) => const WorkflowPage(),
      ),
      GoRoute(
        path: '/profile',
        name: 'profile',
        builder: (context, state) => const ProfilePage(),
      ),
    ],
  );

  runApp(
    MaterialApp.router(
      title: 'Area',
      theme: ThemeData(
          primarySwatch: Colors.green,
          scrollbarTheme: ScrollbarThemeData(
              thumbColor: WidgetStateProperty.all(Colors.black))),
      routerConfig: router,
    ),
  );
}
