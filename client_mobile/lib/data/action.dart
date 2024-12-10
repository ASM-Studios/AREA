import 'package:client_mobile/data/parameter.dart';

class WorkflowActionReaction {
  final int id;
  final String name;
  final String description;
  final List<Parameter> parameters;
  String? serviceName;
  int? serviceId;

  WorkflowActionReaction({
    required this.id,
    required this.name,
    required this.description,
    required this.parameters,
    this.serviceName,
    this.serviceId
  });

  factory WorkflowActionReaction.fromJson(Map<String, dynamic> json) {
    return WorkflowActionReaction(
      id: json['id'],
      name: json['name'],
      description: json['description'] ?? "",
      parameters: json['parameters'] != null
          ? (json['parameters'] as List)
              .map((param) => Parameter.fromJson(param))
              .toList()
          : [],
    );
  }

  Map<String, dynamic> toJson(String type) {
    return {
      'id': id,
      'name': name,
      'type': type,
      'description': description,
      'parameters': parameters.map((p) => p.toJson()).toList(),
    };
  }
}
