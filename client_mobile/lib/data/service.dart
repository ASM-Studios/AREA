import 'dart:convert';

import 'package:client_mobile/data/action.dart';

// Classe pour les services
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
    return WorkflowService(
      id: json['id'],
      name: json['name'],
      actions: (json['actions'] as List)
          .map((action) => WorkflowActionReaction.fromJson(action))
          .toList(),
      reactions: (json['reactions'] as List)
          .map((reaction) => WorkflowActionReaction.fromJson(reaction))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'actions': actions.map((a) => a.toJson()).toList(),
      'reactions': reactions.map((r) => r.toJson()).toList(),
    };
  }
}

// Classe pour le serveur
class Server {
  final String currentTime;
  final List<WorkflowService> services;

  Server({
    required this.currentTime,
    required this.services,
  });

  factory Server.fromJson(Map<String, dynamic> json) {
    return Server(
      currentTime: json['current_time'],
      services: (json['services'] as List)
          .map((service) => WorkflowService.fromJson(service))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'current_time': currentTime,
      'services': services.map((s) => s.toJson()).toList(),
    };
  }
}
