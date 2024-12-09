import 'package:client_mobile/services/login/auth_service.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: const Center(
        child: Text("Dashboard "),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          bool hasLogout = await AuthService.logout();
          if (hasLogout)
            context.pushReplacement("/login");
        },
        tooltip: 'Logout',
        child: const Icon(Icons.login),
      ),
    );
  }
}
