import 'package:client_mobile/data/action.dart';
import 'package:client_mobile/data/service.dart';
import 'package:client_mobile/data/service_metadata.dart';
import 'package:client_mobile/pages/dashboard/service_selection.dart';
import 'package:flutter/material.dart';

class ReactionButton extends StatefulWidget {
  const ReactionButton(
      {super.key, required this.onActionSelected, this.reaction});

  final Function(WorkflowActionReaction, WorkflowService) onActionSelected;
  final WorkflowActionReaction? reaction;

  @override
  State<ReactionButton> createState() => _ReactionButtonState();
}

class _ReactionButtonState extends State<ReactionButton> {
  ServiceMetadata? serviceMetadata;

  @override
  Widget build(BuildContext context) {
    if (widget.reaction != null)
      serviceMetadata =
          ServiceMetadata.getServiceByName(widget.reaction!.serviceName!);

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
            widget.reaction == null
                ? "Then That"
                : "Then ${widget.reaction!.name}",
            style: TextStyle(
              fontSize: widget.reaction == null ? 40 : 16,
              color: serviceMetadata != null ? (serviceMetadata!.color == Colors.white ? Colors.black : Colors.white) : Colors.white
            ),
          ),
          if (widget.reaction == null) const Spacer(),
          if (widget.reaction == null)
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).push(MaterialPageRoute(
                    builder: (ctx) => ServiceSelectionPage(
                        isAction: false,
                        onActionSelected: widget.onActionSelected)));
              },
              child: const Text(
                "Add",
                style: TextStyle(
                  color: Colors.black,
                ),
              ),
            ),
          if (widget.reaction != null) const Spacer(),
          if (widget.reaction != null)
            Image.asset(serviceMetadata!.imagePath, width: 50, height: 50)
        ],
      ),
    );
  }
}
