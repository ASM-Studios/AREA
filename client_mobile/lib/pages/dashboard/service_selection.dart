import 'dart:convert';
import 'dart:developer';
import 'package:client_mobile/data/action.dart';
import 'package:client_mobile/data/service.dart';
import 'package:client_mobile/services/about/about_service.dart';
import 'package:flutter/material.dart';

// Page principale avec FutureBuilder
class ServiceSelectionPage extends StatelessWidget {
  final Function(WorkflowActionReaction) onActionSelected;

  ServiceSelectionPage({required this.onActionSelected});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Select a Service'),
      ),
      body: FutureBuilder<List<WorkflowService>>(
        future: AboutService.getAbout(), // Appelle la méthode API
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(
              child: Text('Erreur : ${snapshot.error}'),
            );
          }
          if (snapshot.hasData) {
            final services = snapshot.data!;

            return ListView.builder(
              itemCount: services.length,
              itemBuilder: (context, index) {
                return ListTile(
                  title: Text(services[index].name),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => ActionSelectionPage(
                          serviceName: services[index].name,
                          onActionSelected: onActionSelected,
                        ),
                      ),
                    );
                  },
                );
              },
            );
          }
          return Center(
            child: Text('Aucun service disponible'),
          );
        },
      ),
    );
  }
}

// Page d'action
class ActionSelectionPage extends StatelessWidget {
  final String serviceName;
  final Function(WorkflowActionReaction) onActionSelected;

  ActionSelectionPage({
    required this.serviceName,
    required this.onActionSelected,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Actions for $serviceName'),
      ),
      body: Center(
        child: Text('Choisissez une action pour $serviceName.'),
      ),
    );
  }
}
