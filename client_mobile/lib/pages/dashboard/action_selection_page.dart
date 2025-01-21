import 'package:area/config/settings_config.dart';
import 'package:area/config/translation_config.dart';
import 'package:area/data/action.dart';
import 'package:area/data/service.dart';
import 'package:area/pages/dashboard/workflow_parameters_page.dart';
import 'package:flutter/material.dart';

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
          TranslationConfig.translate("select_action", language: SettingsConfig.language),
            style: const TextStyle(color: Colors.black, fontSize: 24, fontWeight: FontWeight.bold),
        ),
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: widget.actions.length,
        separatorBuilder: (context, index) => const Divider(
          color: Colors.black12,
          thickness: 0.5,
        ),
        itemBuilder: (context, index) {
          return ListTile(
            title: Text(
              widget.actions[index].name,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w500,
              ),
            ),
            trailing: const Icon(Icons.arrow_forward_ios,
                color: Colors.black, size: 18),
            onTap: () async {
              if (widget.actions[index].parameters.isNotEmpty) {
                widget.actions[index] = await Navigator.of(context).push(
                    MaterialPageRoute(
                        builder: (ctx) => WorkflowParametersPage(
                            action: widget.actions[index])));
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
