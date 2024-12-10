import 'package:client_mobile/data/action.dart';
import 'package:client_mobile/data/service.dart';
import 'package:client_mobile/data/service_metadata.dart';
import 'package:client_mobile/pages/dashboard/action_selection_page.dart';
import 'package:client_mobile/services/about/about_service.dart';
import 'package:flutter/material.dart';

// Page principale avec FutureBuilder
class ServiceSelectionPage extends StatelessWidget {
  final Function(WorkflowActionReaction, String) onActionSelected;
  final bool isAction;

  const ServiceSelectionPage({
    super.key,
    required this.onActionSelected,
    required this.isAction,
  });

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

            return GridView.builder(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 8.0,
                mainAxisSpacing: 8.0,
                childAspectRatio: 1.0,
              ),
              itemCount: services.length,
              itemBuilder: (context, index) {
                return Card(
                  elevation: 4.0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8.0),
                  ),
                  color: ServiceMetadata.getServiceByName(services[index].name)!
                      .color,
                  child: InkWell(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => ActionSelectionPage(
                            serviceName: services[index].name,
                            onActionSelected: onActionSelected,
                            actions: isAction
                                ? services[index].actions
                                : services[index].reactions,
                          ),
                        ),
                      );
                    },
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Center(
                          child: Image.asset(
                            ServiceMetadata.getServiceByName(
                                    services[index].name)!
                                .imagePath,
                            width: 50,
                          ),
                        ),
                        const SizedBox(height: 8.0),
                        Text(
                          services[index].name.toUpperCase(),
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 16.0,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            );
          }
          return const Center(
            child: Text('No service available'),
          );
        },
      ),
    );
  }
}
