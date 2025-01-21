import 'package:area/config/settings_config.dart';
import 'package:area/config/translation_config.dart';
import 'package:area/data/action.dart';
import 'package:area/data/service_metadata.dart';
import 'package:area/data/workflow.dart';
import 'package:area/services/workflow/workflow_service.dart';
import 'package:area/widgets/action_button.dart';
import 'package:area/widgets/button.dart';
import 'package:area/widgets/form_field.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

const int actionLimit = 1;
const int reactionLimit = 10;

class WorkflowPage extends StatefulWidget {
  const WorkflowPage({super.key});

  @override
  State<WorkflowPage> createState() => _WorkflowPageState();
}

class _WorkflowPageState extends State<WorkflowPage> {
  List<WorkflowActionReaction> actions = [];
  List<WorkflowActionReaction> reactions = [];

  void onActionSelected(WorkflowActionReaction selected) {
    setState(() {
      actions.add(selected);
    });
  }

  void onReactionSelected(WorkflowActionReaction selected) {
    setState(() {
      reactions.add(selected);
    });
  }

  void createWorkflow() async {
    if (actions.isEmpty || reactions.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            TranslationConfig.translate(
              "action_error",
              language: SettingsConfig.language,
            ),
          ),
          backgroundColor: Colors.red,
        ),
      );
    } else {
      final workflowDetails = await _showWorkflowDetailsDialog(context);
      if (workflowDetails != null) {
        final name = workflowDetails["name"];
        final description = workflowDetails["description"];
        List<int> servicesId = [];
        for (WorkflowActionReaction action in actions) {
          servicesId.add(action.serviceId!);
        }
        for (WorkflowActionReaction reaction in reactions) {
          if (!servicesId.contains(reaction.serviceId!)) {
            servicesId.add(reaction.serviceId!);
          }
        }
        bool hasCreatedWorkflow = await UpdateWorkflowService.createWorkflow(
          Workflow(
            name: name!,
            description: description!,
            servicesId: servicesId,
            events: [
              ...actions.map(
                  (action) => WorkflowEvent(action: action, type: "action")),
              ...reactions.map((reaction) =>
                  WorkflowEvent(action: reaction, type: "reaction")),
            ],
          ),
        );

        if (hasCreatedWorkflow) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                TranslationConfig.translate(
                  "workflow_success",
                  language: SettingsConfig.language,
                ),
              ),
              backgroundColor: Colors.black,
            ),
          );
          GoRouter.of(context).pushReplacement("/workflow/list");
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                TranslationConfig.translate(
                  "workflow_error",
                  language: SettingsConfig.language,
                ),
              ),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    }
  }

  Future<Map<String, String>?> _showWorkflowDetailsDialog(
      BuildContext context) async {
    final TextEditingController nameController = TextEditingController();
    final TextEditingController descriptionController = TextEditingController();

    return showDialog<Map<String, String>>(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text(
            TranslationConfig.translate(
              "workflow_details",
              language: SettingsConfig.language,
            ),
          ),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                AreaFormField(
                  label: TranslationConfig.translate(
                    "name",
                    language: SettingsConfig.language,
                  ),
                  controller: nameController,
                ),
                const SizedBox(height: 20),
                AreaFormField(
                  label: TranslationConfig.translate(
                    "description",
                    language: SettingsConfig.language,
                  ),
                  controller: descriptionController,
                  maxLines: 4,
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop(null);
              },
              child: Text(
                TranslationConfig.translate(
                  "cancel",
                  language: SettingsConfig.language,
                ),
                style: TextStyle(color: Colors.red),
              ),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).pop({
                  "name": nameController.text,
                  "description": descriptionController.text,
                });
              },
              child: Text(
                TranslationConfig.translate(
                  "save",
                  language: SettingsConfig.language,
                ),
              ),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          leading: IconButton(
            icon: const Icon(Icons.close),
            onPressed: () {
              Navigator.of(context).pop();
            },
            tooltip: TranslationConfig.translate(
              "close",
              language: SettingsConfig.language,
            ),
          ),
          title: Text(
            TranslationConfig.translate(
              "create_workflow",
              language: SettingsConfig.language,
            ),
            style: const TextStyle(
                color: Colors.black, fontSize: 24, fontWeight: FontWeight.bold),
          )),
      body: SingleChildScrollView(
        child: Column(
          children: [
            const SizedBox(height: 50),
            for (int index = 0;
                index < actions.length && index < actionLimit;
                index++) ...[
              ActionButton(
                onActionSelected: onActionSelected,
                action: actions[index],
                serviceMetadata: ServiceMetadata.getServiceByName(
                    actions[index].serviceName!),
                first: index == 0,
              ),
              const SizedBox(height: 15)
            ],
            if (actions.length < actionLimit)
              ActionButton(
                onActionSelected: onActionSelected,
                action: null,
                serviceMetadata: null,
                first: actions.isEmpty,
              ),
            const SizedBox(height: 30),
            Divider(
              color: Colors.black,
              thickness: 1,
            ),
            const SizedBox(height: 30),
            for (int index = 0;
                index < reactions.length && index < reactionLimit;
                index++) ...[
              ActionButton(
                onActionSelected: onReactionSelected,
                action: reactions[index],
                serviceMetadata: ServiceMetadata.getServiceByName(
                    reactions[index].serviceName!),
                first: index == 0,
                isAction: false,
              ),
              const SizedBox(height: 15)
            ],
            if (reactions.length < reactionLimit)
              ActionButton(
                onActionSelected: onReactionSelected,
                action: null,
                serviceMetadata: null,
                first: reactions.isEmpty,
                isAction: false,
              ),
            const SizedBox(height: 100),
          ],
        ),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      floatingActionButton: Padding(
        padding: EdgeInsets.all(20),
        child: AreaButton(
          label: TranslationConfig.translate(
            "create",
            language: SettingsConfig.language,
          ),
          onPressed: createWorkflow,
          color: const Color(0XFF035a63),
        ),
      ),
    );
  }
}
