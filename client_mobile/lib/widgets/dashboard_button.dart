import 'package:client_mobile/data/action.dart';
import 'package:client_mobile/pages/dashboard/service_selection.dart';
import 'package:flutter/material.dart';

class DashboardButton extends StatefulWidget {
  const DashboardButton({super.key, required this.onActionSelected});

  final Function(WorkflowActionReaction) onActionSelected;

  @override
  State<DashboardButton> createState() => _DashboardButtonState();
}

class _DashboardButtonState extends State<DashboardButton> {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      margin: const EdgeInsets.fromLTRB(20, 0, 20, 0),
      width: MediaQuery.of(context).size.width,
      height: 110,
      // alignment: Alignment.center,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(10),
        boxShadow: const [
          BoxShadow(
              color: Colors.grey,
              blurRadius: 5,
              spreadRadius: 1,
              offset: Offset(4, 4)),
        ],
        color: Colors.black,
      ),
      child: Row(
        children: [
          const SizedBox(width: 10),
          const Text(
            "If  This",
            style: TextStyle(
              fontSize: 48,
              color: Colors.white,
            ),
          ),
          const Spacer(),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).push(MaterialPageRoute(
                  builder: (ctx) => ServiceSelectionPage(
                      onActionSelected: widget.onActionSelected)));
            },
            child: const Text(
              "Add",
              style: TextStyle(
                color: Colors.black,
              ),
            ),
          )
        ],
      ),
    );
  }
}
