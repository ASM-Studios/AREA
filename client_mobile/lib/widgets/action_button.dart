import 'package:area/data/action.dart';
import 'package:area/data/service.dart';
import 'package:area/data/service_metadata.dart';
import 'package:area/pages/dashboard/service_selection.dart';
import 'package:flutter/material.dart';

class ActionButton extends StatelessWidget {
  const ActionButton(
      {super.key,
      required this.onActionSelected,
      this.serviceMetadata,
      this.action,
      this.first = true,
      this.isAction = true});

  final Function(WorkflowActionReaction, WorkflowService) onActionSelected;
  final ServiceMetadata? serviceMetadata;
  final WorkflowActionReaction? action;
  final bool first;
  final bool isAction;

  String getButtonText() {
    String prefix;

    if (isAction) {
      prefix = first ? "If" : "And";
    } else {
      prefix = first ? "Then" : "And";
    }

    return action == null
        ? "$prefix ${first ? 'This' : '...'}"
        : "$prefix ${action!.name}";
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      margin: const EdgeInsets.fromLTRB(20, 0, 20, 0),
      width: MediaQuery.of(context).size.width,
      height: 90,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(10),
        boxShadow: const [
          BoxShadow(
              color: Colors.grey,
              blurRadius: 5,
              spreadRadius: 1,
              offset: Offset(4, 4)),
        ],
        color: serviceMetadata != null ? serviceMetadata!.color : Colors.black,
      ),
      child: Row(
        children: [
          const SizedBox(width: 10),
          Text(
            getButtonText(),
            style: TextStyle(
                fontSize: action == null ? 36 : 16,
                color: serviceMetadata != null
                    ? (serviceMetadata!.color == Colors.white
                        ? Colors.black
                        : Colors.white)
                    : Colors.white),
          ),
          if (action == null) const Spacer(),
          if (action == null)
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).push(MaterialPageRoute(
                    builder: (ctx) => ServiceSelectionPage(
                        isAction: isAction,
                        onActionSelected: onActionSelected)));
              },
              child: const Text(
                "Add",
                style: TextStyle(
                  color: Colors.black,
                ),
              ),
            ),
          if (action != null) const Spacer(),
          if (action != null)
            Image.asset(serviceMetadata!.imagePath, width: 50, height: 50)
        ],
      ),
    );
  }
}
