import 'package:client_mobile/data/workflow.dart';
import 'package:flutter/material.dart';

class WorkflowContainer extends StatelessWidget {
  final Workflow workflow;

  const WorkflowContainer({super.key, required this.workflow});

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
        key: Key("tqt"),
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
                // mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  const Icon(Icons.pending),
                  Spacer(),
                  Text("un texte beaucoup trop long que se passe il"),
                  Spacer(),
                  const Icon(Icons.tram_sharp)
                ],
              )
            ],
          ),
        )),
      ),
    );
  }
}
