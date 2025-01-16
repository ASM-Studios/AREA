import 'package:area/data/action.dart';
import 'package:area/data/service_metadata.dart';
import 'package:area/data/workflow.dart';
import 'package:area/services/workflow/workflow_service.dart';
import 'package:area/widgets/action_button.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

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

  Future<Map<String, String>?> _showWorkflowDetailsDialog(
      BuildContext context) async {
    final TextEditingController nameController = TextEditingController();
    final TextEditingController descriptionController = TextEditingController();

    return showDialog<Map<String, String>>(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text("Workflow Details"),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: nameController,
                decoration: const InputDecoration(
                  labelText: "Name",
                ),
              ),
              const SizedBox(height: 20),
              TextField(
                controller: descriptionController,
                decoration: const InputDecoration(
                  labelText: "Description",
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop(null);
              },
              child: const Text("Cancel"),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).pop({
                  "name": nameController.text,
                  "description": descriptionController.text,
                });
              },
              child: const Text("Save"),
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
            tooltip: "Close",
          ),
          title: Text(
            "Create workflow",
            style: GoogleFonts.fjallaOne(
              textStyle: const TextStyle(color: Colors.black, fontSize: 24),
            ),
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
            const SizedBox(height: 50),
            ElevatedButton(
                onPressed: () async {
                  if (actions.isEmpty || reactions.isEmpty) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text("Please refer an action and a reaction"),
                        backgroundColor: Colors.red,
                      ),
                    );
                  } else {
                    final workflowDetails =
                        await _showWorkflowDetailsDialog(context);
                    if (workflowDetails != null) {
                      final name = workflowDetails["name"];
                      final description = workflowDetails["description"];
                      print("Creating workflow with:");
                      print("Name: $name");
                      print("Description: $description");
                      List<int> servicesId = [];
                      for (WorkflowActionReaction action in actions) {
                        servicesId.add(action.serviceId!);
                      }
                      for (WorkflowActionReaction reaction in reactions) {
                        if (!servicesId.contains(reaction.serviceId!)) {
                          servicesId.add(reaction.serviceId!);
                        }
                      }
                      bool hasCreatedWorkflow =
                          await UpdateWorkflowService.createWorkflow(
                        Workflow(
                          name: name!,
                          description: description!,
                          servicesId: servicesId,
                          events: [
                            ...actions.map((action) =>
                                WorkflowEvent(action: action, type: "action")),
                            ...reactions.map((reaction) => WorkflowEvent(
                                action: reaction, type: "reaction")),
                          ],
                        ),
                      );

                      if (hasCreatedWorkflow) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text("Workflow successfully created !"),
                            backgroundColor: Colors.black,
                          ),
                        );
                        GoRouter.of(context).pushReplacement("/workflow/list");
                      } else {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text("Workflow failed to be created."),
                            backgroundColor: Colors.red,
                          ),
                        );
                      }
                    }
                  }
                },
                child: const Text("Create"))
          ],
        ),
      ),
    );
  }
}
