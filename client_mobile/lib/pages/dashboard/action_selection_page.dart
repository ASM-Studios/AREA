import 'package:area/data/action.dart';
import 'package:area/data/parameter.dart';
import 'package:area/data/service.dart';
import 'package:area/pages/dashboard/workflow_parameters_page.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class ActionSelectionPage extends StatefulWidget {
  final WorkflowService service;
  final Function(WorkflowActionReaction) onActionSelected;
  final List<WorkflowActionReaction> actions;

  const ActionSelectionPage({
    super.key,
    required this.service,
    required this.onActionSelected,
    required this.actions,
  });

  @override
  State<ActionSelectionPage> createState() => _ActionSelectionPageState();
}

class _ActionSelectionPageState extends State<ActionSelectionPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Select Action/Reaction',
          style: GoogleFonts.fjallaOne(
            textStyle: const TextStyle(color: Colors.black, fontSize: 24),
          ),
        ),
      ),
      body: ListView.builder(
        itemCount: widget.actions.length,
        itemBuilder: (context, index) {
          return ListTile(
            title: Text(widget.actions[index].name),
            onTap: () async {
              if (widget.actions[index].parameters.isNotEmpty) {
                widget.actions[index] = await Navigator.of(context).push(
                    MaterialPageRoute(
                        builder: (ctx) => WorkflowParametersPage(
                            action: widget.actions[index])));
              }
              for (Parameter parameter in widget.actions[index].parameters) {
                print(
                    "paramètre : ${parameter.name} avec valeur : ${parameter.value}");
              }
              widget.onActionSelected(widget.actions[index]);
              Navigator.of(context).popUntil((route) {
                return route.settings.name == "workflowCreation";
              });
            },
          );
        },
      ),
    );
  }
}
