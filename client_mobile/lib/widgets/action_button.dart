import 'package:client_mobile/data/action.dart';
import 'package:client_mobile/data/service.dart';
import 'package:client_mobile/data/service_metadata.dart';
import 'package:client_mobile/pages/dashboard/service_selection.dart';
import 'package:flutter/material.dart';

class ActionButton extends StatefulWidget {
  const ActionButton({super.key, required this.onActionSelected, this.action});

  final Function(WorkflowActionReaction, WorkflowService) onActionSelected;
  final WorkflowActionReaction? action;

  @override
  State<ActionButton> createState() => _ActionButtonState();
}

class _ActionButtonState extends State<ActionButton> {
  ServiceMetadata? serviceMetadata;

  @override
  Widget build(BuildContext context) {
    if (widget.action != null) {
      serviceMetadata =
          ServiceMetadata.getServiceByName(widget.action!.serviceName!);
    }
    return Container(
      padding: const EdgeInsets.all(20),
      margin: const EdgeInsets.fromLTRB(20, 0, 20, 0),
      width: MediaQuery.of(context).size.width,
      height: 110,
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
            widget.action == null ? "If  This" : "If ${widget.action!.name}",
            style: TextStyle(
              fontSize: widget.action == null ? 48 : 16,
              color: Colors.white,
            ),
          ),
          if (widget.action == null) const Spacer(),
          if (widget.action == null)
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).push(MaterialPageRoute(
                    builder: (ctx) => ServiceSelectionPage(
                        isAction: true,
                        onActionSelected: widget.onActionSelected)));
              },
              child: const Text(
                "Add",
                style: TextStyle(
                  color: Colors.black,
                ),
              ),
            ),
          if (widget.action != null) const Spacer(),
          if (widget.action != null)
            Image.asset(serviceMetadata!.imagePath, width: 50, height: 50)
        ],
      ),
    );
  }
}
