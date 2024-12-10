import 'package:client_mobile/data/action.dart';
import 'package:client_mobile/data/service.dart';
import 'package:client_mobile/data/workflow.dart';
import 'package:client_mobile/services/login/auth_service.dart';
import 'package:client_mobile/services/workflow/workflow_service.dart';
import 'package:client_mobile/widgets/action_button.dart';
import 'package:client_mobile/widgets/reaction_button.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class WorkflowPage extends StatefulWidget {
  const WorkflowPage({super.key});

  @override
  State<WorkflowPage> createState() => _WorkflowPageState();
}

class _WorkflowPageState extends State<WorkflowPage> {
  WorkflowActionReaction? action;
  WorkflowActionReaction? reaction;

  void onActionSelected(
      WorkflowActionReaction selected, WorkflowService service) {
    setState(() {
      action = selected;
      action!.serviceName = service.name;
      action!.serviceId = service.id;
    });
  }

  void onReactionSelected(
      WorkflowActionReaction selected, WorkflowService service) {
    setState(() {
      reaction = selected;
      reaction!.serviceName = service.name;
      reaction!.serviceId = service.id;
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
      body: Column(
        children: [
          const SizedBox(height: 50),
          ActionButton(onActionSelected: onActionSelected, action: action),
          const SizedBox(height: 30),
          ReactionButton(
              onActionSelected: onReactionSelected, reaction: reaction),
          const SizedBox(height: 50),
          ElevatedButton(
              onPressed: () async {
                if (action == null || reaction == null) {
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
                    servicesId.add(action!.serviceId!);
                    if (action!.serviceId! != reaction!.serviceId!)
                      servicesId.add(reaction!.serviceId!);

                    bool hasCreatedWorkflow =
                        await CreateWorkflowService.createWorkflow(
                      Workflow(
                        name: name!,
                        description: description!,
                        servicesId: servicesId,
                        events: [
                          WorkflowEvent(action: action!, type: "action"),
                          WorkflowEvent(action: reaction!, type: "reaction")
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
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          bool hasLogout = await AuthService.logout();
          if (hasLogout) context.pushReplacement("/login");
        },
        tooltip: 'Logout',
        child: const Icon(Icons.login),
      ),
    );
  }
}
