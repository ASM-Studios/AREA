import 'package:client_mobile/data/action.dart';
import 'package:flutter/material.dart';

class ActionSelectionPage extends StatelessWidget {
  final String serviceName;
  final Function(WorkflowActionReaction) onActionSelected;

  ActionSelectionPage({required this.serviceName, required this.onActionSelected});

  @override
  Widget build(BuildContext context) {
    // Actions fictives pour chaque service
    final actions = {
      'Spotify': ['Play Song', 'Pause Song', 'Add to Playlist'],
      'Microsoft': ['Create File', 'Delete File', 'Edit File'],
      'Discord': ['Send Message', 'Delete Message', 'Pin Message'],
    };

    final serviceActions = actions[serviceName] ?? [];

    return Scaffold(
      appBar: AppBar(
        title: Text('Select Action/Reaction'),
      ),
      body: ListView.builder(
        itemCount: serviceActions.length,
        itemBuilder: (context, index) {
          return ListTile(
            title: Text(serviceActions[index]),
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
