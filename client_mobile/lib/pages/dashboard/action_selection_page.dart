import 'package:client_mobile/data/action.dart';
import 'package:flutter/material.dart';

class ActionSelectionPage extends StatelessWidget {
  final String serviceName;
  final Function(WorkflowActionReaction) onActionSelected;
  final List<WorkflowActionReaction> actions;

  ActionSelectionPage(
      {required this.serviceName,
      required this.onActionSelected,
      required this.actions});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Select Action/Reaction'),
      ),
      body: ListView.builder(
        itemCount: actions.length,
        itemBuilder: (context, index) {
          return ListTile(
            title: Text(actions[index].name),
            onTap: () {
              // Passer directement à la première page avec l'action choisie
              // onActionSelected(serviceActions[index]);
              Navigator.popUntil(context, (route) => route.isFirst);
            },
          );
        },
      ),
    );
  }
}
