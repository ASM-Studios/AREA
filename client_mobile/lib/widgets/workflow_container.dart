import 'package:client_mobile/data/workflow.dart';
import 'package:client_mobile/services/workflow/workflow_service.dart';
import 'package:flutter/material.dart';

class WorkflowContainer extends StatelessWidget {
  final Workflow workflow;
  final Function(int) onRemove;

  const WorkflowContainer(
      {super.key, required this.workflow, required this.onRemove});

  Icon _getStatusIcon(String status) {
    switch (status) {
      case "pending":
        return const Icon(Icons.access_time, color: Colors.orange);
      case "failed":
        return const Icon(Icons.close, color: Colors.red);
      case "processed":
        return const Icon(Icons.check_circle, color: Colors.green);
      default:
        return const Icon(Icons.close, color: Colors.red);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 100,
      decoration: const BoxDecoration(
        boxShadow: [
          BoxShadow(
            color: Colors.black,
            blurRadius: 1.0,
          ),
        ],
      ),
      child: Dismissible(
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
            child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Column(
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                    // mainAxisAlignment: MainAxisAlignment.center,
                children: [
                    Align(
                      alignment: Alignment.center,
                      child: Text(workflow.name)),
                  // Spacer(),
                  Align(
                    alignment: Alignment.centerRight,
                    child: _getStatusIcon(workflow.status!),
                  )
                ],
              ),
              // Spacer(),
              Center(
                child: Text(workflow.description),
              )
            ],
          ),
        )),
      ),
    );
  }
}
