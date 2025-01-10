import 'package:area/data/action.dart';

class WorkflowEvent {
  final WorkflowActionReaction action;
  final String type;

  WorkflowEvent({required this.action, required this.type});
}

class Workflow {
  final String name;
  final String description;
  final List<int> servicesId;
  final List<WorkflowEvent> events;
  final String? status;
  int id;

  Workflow({
    required this.name,
    required this.description,
    required this.servicesId,
    required this.events,
    this.status,
    this.id = 0
  });

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'description': description,
      'services': servicesId,
      'events': events.map((event) => event.action.toJson(event.type)).toList(),
    };
  }

   factory Workflow.fromJson(Map<String, dynamic> json) {
    try {
      return Workflow(
        id: json['ID'] ?? 0,
        name: json['name'] ??
            'Unknown',
        description: json['description'],
        status: json['status'],
        servicesId: [],
        events: []
      );
    } catch (e) {
      print('Error parsing Workflow: $e');
      return Workflow(
          name: 'Unknown', status: "failed", description: "Unknown", servicesId: [], events: []);
    }
  }
}
