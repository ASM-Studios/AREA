import 'package:client_mobile/data/action.dart';
import 'package:client_mobile/services/login/auth_service.dart';
import 'package:client_mobile/widgets/dashboard_button.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {

  WorkflowActionReaction? action;

  void onActionSelected(WorkflowActionReaction selected) {
    setState(() {
      action = selected;
    });
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          const SizedBox(height: 50),
          DashboardButton(onActionSelected: onActionSelected,),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          bool hasLogout = await AuthService.logout();
          if (hasLogout)  context.pushReplacement("/login");
        },
        tooltip: 'Logout',
        child: const Icon(Icons.login),
      ),
    );
  }
}
