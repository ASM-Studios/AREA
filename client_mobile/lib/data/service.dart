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
    // Vérifier si les clés attendues existent dans le JSON
    try {
      return WorkflowService(
        id: json['id'] ?? 0, // Par défaut, 0 si 'id' est manquant
        name: json['name'] ??
            'Unknown', // Par défaut, 'Unknown' si 'name' est manquant
        actions: _parseActionsOrReactions(json['actions']),
        reactions: _parseActionsOrReactions(json['reactions']),
      );
    } catch (e) {
      // En cas d'erreur dans le parsing, afficher un message d'erreur
      print('Error parsing WorkflowService: $e');
      // Retourner un objet avec des valeurs par défaut ou gérer autrement selon les besoins
      return WorkflowService(
          id: 0, name: 'Unknown', actions: [], reactions: []);
    }
  }

// Fonction privée pour gérer la conversion des actions et des réactions
  static List<WorkflowActionReaction> _parseActionsOrReactions(dynamic data) {
    if (data == null) {
      // Si la donnée est nulle, retourner une liste vide
      return [];
    }

    // Si la donnée est une liste, essayer de la convertir
    if (data is List) {
      return data.map((item) => WorkflowActionReaction.fromJson(item)).toList();
    } else {
      // Si la donnée n'est pas une liste, afficher une erreur et retourner une liste vide
      print('Expected a list for actions or reactions, but got: $data');
      return [];
    }
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