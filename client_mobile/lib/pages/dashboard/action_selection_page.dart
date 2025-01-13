import 'package:area/data/action.dart';
import 'package:area/data/parameter.dart';
import 'package:area/data/service.dart';
import 'package:flutter/material.dart';

class ActionSelectionPage extends StatelessWidget {
  final WorkflowService service;
  final Function(WorkflowActionReaction, WorkflowService) onActionSelected;
  final List<WorkflowActionReaction> actions;

  const ActionSelectionPage(
      {super.key,
      required this.service,
      required this.onActionSelected,
      required this.actions});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Select Action/Reaction'),
      ),
      body: ListView.builder(
        itemCount: actions.length,
        itemBuilder: (context, index) {
          return ListTile(
            title: Text(actions[index].name),
            onTap: () async {
              for (var param in actions[index].parameters) {
                String? updatedValue =
                    await _showParameterDialog(context, param);
                param.value = updatedValue;
              }
              onActionSelected(actions[index], service);
              Navigator.of(context).popUntil((route) {
                return route.settings.name == "workflowCreation";
              });
            },
          );
        },
      ),
    );
  }

  Future<String?> _showParameterDialog(
      BuildContext context, Parameter parameter) async {
    TextEditingController controller = TextEditingController();

    return showDialog<String>(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Enter value for ${parameter.name}'),
          content: TextField(
            controller: controller,
            decoration: InputDecoration(
              hintText: 'Enter value for ${parameter.name}',
            ),
          ),
          actions: <Widget>[
            TextButton(
              onPressed: () {
                Navigator.pop(context, controller.text);
              },
              child: const Text('OK'),
            ),
          ],
        );
      },
    );
  }
}
