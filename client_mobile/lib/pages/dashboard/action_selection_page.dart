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

    String? selectedValue;
    Widget contentWidget;

    if (parameter.type == "string") {
      contentWidget = TextField(
        controller: controller,
        decoration: InputDecoration(
          hintText: 'Enter value for ${parameter.name}',
        ),
      );
    } else if (parameter.type == "bool") {
      selectedValue = "true";
      contentWidget = DropdownButton<String>(
        value: selectedValue,
        items: ["true", "false"].map((String value) {
          return DropdownMenuItem<String>(
            value: value,
            child: Text(value),
          );
        }).toList(),
        onChanged: (String? newValue) {
          selectedValue = newValue;
        },
      );
    } else if (parameter.type == "datetime") {
      contentWidget = TextButton(
        child: Text(selectedValue ?? 'Select a date'),
        onPressed: () async {
          DateTime? pickedDate = await showDatePicker(
            context: context,
            initialDate: DateTime.now(),
            firstDate: DateTime(2000),
            lastDate: DateTime(2100),
          );
          if (pickedDate != null) {
            selectedValue = pickedDate.toIso8601String();
          }
        },
      );
    } else {
      contentWidget = const Text("Unsupported parameter type");
    }

    return showDialog<String>(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Enter value for ${parameter.name}'),
          content: contentWidget,
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
