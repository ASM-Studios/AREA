import 'package:client_mobile/data/action.dart';

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
      return WorkflowService(
        id: json['id'] ?? 0,
        name: json['name'] ??
            'Unknown',
        actions: _parseActionsOrReactions(json['actions']),
        reactions: _parseActionsOrReactions(json['reactions']),
      );
    } catch (e) {
      print('Error parsing WorkflowService: $e');
      return WorkflowService(
          id: 0, name: 'Unknown', actions: [], reactions: []);
    }
  }

  static List<WorkflowActionReaction> _parseActionsOrReactions(dynamic data) {
    if (data == null) {
      return [];
    }
    if (data is List) {
      return data.map((item) => WorkflowActionReaction.fromJson(item)).toList();
    } else {
      print('Expected a list for actions or reactions, but got: $data');
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