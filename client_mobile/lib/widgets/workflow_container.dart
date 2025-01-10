import 'package:client_mobile/data/workflow.dart';
import 'package:client_mobile/services/workflow/workflow_service.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

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
          side: BorderSide(
            color: Colors.black,
            width: 2,
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Column(
            spacing: 40,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Expanded(
                    child: Text(
                      workflow.name,
                      textAlign: TextAlign.center,
                      overflow: TextOverflow.ellipsis,
                      maxLines: 1,
                      style: GoogleFonts.fjallaOne(
                        textStyle: const TextStyle(
                            fontWeight: FontWeight.bold,
                            color: Colors.black,
                            fontSize: 14),
                      ),
                    ),
                  ),
                  _getStatusIcon(workflow.status!),
                ],
              ),
              Center(
                child: Text(
                    overflow: TextOverflow.ellipsis,
                    maxLines: 4,
                    workflow.description)
                    // "Ce workflow est absolument exceptionnel, il fait plein de trucs cool genre il envoie des mails à ma place tout ça tout ça ouais ça débite beaucoup là quand même c'est juste pour voir comment ça rend quand y'a bcp de texte"),
              )
            ],
          ),
        ),
      ),
    );
  }
}
