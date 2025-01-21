import 'package:area/data/action.dart';

class WorkflowService {
  final int id;
  final String name;
  final List<WorkflowActionReaction> actions;
  final List<WorkflowActionReaction> reactions;

  WorkflowService({
    required this.id,
    required this.name,
    required this.actions,
    required this.reactions,
  });

  factory WorkflowService.fromJson(Map<String, dynamic> json) {
    try {
      int serviceId = json['id'] ?? 0;
      String serviceName = json['name'] ?? 'Unknown';

      return WorkflowService(
        id: serviceId,
        name: serviceName,
        actions:
            _parseActionsOrReactions(json['actions'], serviceId, serviceName),
        reactions:
            _parseActionsOrReactions(json['reactions'], serviceId, serviceName),
      );
    } catch (e) {
      return WorkflowService(
          id: 0, name: 'Unknown', actions: [], reactions: []);
    }
  }

  static List<WorkflowActionReaction> _parseActionsOrReactions(
      dynamic data, int serviceId, String serviceName) {
    if (data == null) return [];

    if (data is List) {
      return data
          .map((item) =>
              WorkflowActionReaction.fromJson(item, serviceId: serviceId, serviceName: serviceName))
          .toList();
    } else {
      return [];
    }
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'actions': actions.map((a) => a.toJson("action")).toList(),
      'reactions': reactions.map((r) => r.toJson("reaction")).toList(),
    };
  }
}
