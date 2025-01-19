import 'package:area/data/workflow.dart';
import 'package:area/services/workflow/workflow_service.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class WorkflowContainer extends StatelessWidget {
  final Workflow workflow;
  final Function(int) onRemove;

  const WorkflowContainer(
      {super.key, required this.workflow, required this.onRemove});

  @override
  Widget build(BuildContext context) {
    return Dismissible(
      onDismissed: (_) async {
        await UpdateWorkflowService.deleteWorkflow(workflow.id);
        onRemove(workflow.id);
      },
      key: Key(workflow.id.toString()),
      direction: DismissDirection.endToStart,
      background: Container(
        color: Colors.red,
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 20),
        child: const Icon(
          Icons.delete,
          color: Colors.white,
        ),
      ),
      child: Card(
        elevation: 8,
        shadowColor: Colors.black,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(20)),
        ),
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 8.0, 16.0, 8.0),
          child: Column(
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(
                      workflow.name.isNotEmpty
                          ? workflow.name
                          : "No name provided.",
                      textAlign: TextAlign.center,
                      overflow: TextOverflow.ellipsis,
                      maxLines: 1,
                      style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          color: Colors.black,
                          fontSize: 24),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  Expanded(
                    child: Text(
                        overflow: TextOverflow.ellipsis,
                        maxLines: 1,
                        workflow.description.isNotEmpty
                            ? workflow.description
                            : "No description provided."),
                  ),
                  const Icon(Icons.edit)
                ],
              )
            ],
          ),
        ),
      ),
    );
  }
}
