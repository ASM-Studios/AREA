import 'package:client_mobile/data/action.dart';
import 'package:client_mobile/services/login/auth_service.dart';
import 'package:client_mobile/widgets/action_button.dart';
import 'package:client_mobile/widgets/reaction_button.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {

  WorkflowActionReaction? action;
  WorkflowActionReaction? reaction;

  void onActionSelected(WorkflowActionReaction selected, String serviceName) {
    setState(() {
      action = selected;
      action!.serviceName = serviceName;
    });
  }

  void onReactionSelected(WorkflowActionReaction selected, String serviceName) {
    setState(() {
      reaction = selected;
      reaction!.serviceName = serviceName;
    });
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          const SizedBox(height: 50),
          ActionButton(onActionSelected: onActionSelected, action: action),
          const SizedBox(height: 30),
          ReactionButton(onActionSelected: onReactionSelected, reaction: reaction),
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
