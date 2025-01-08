import 'package:client_mobile/data/action.dart';

class WorkflowEvent
{
  final WorkflowActionReaction action;
  final String type;

  WorkflowEvent({
    required this.action,
    required this.type
  });
}


class Workflow {
  final String name;
  final String description;
  final List<int> servicesId;
  final List<WorkflowEvent> events;
  final String? status;

  Workflow({
    required this.name,
    required this.description,
    required this.servicesId,
    required this.events,
    this.status,
  });


  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'description': description,
      'services': servicesId,
      'events': events.map((a) => a.action.toJson(a.type)).toList(),
    };
  }
}