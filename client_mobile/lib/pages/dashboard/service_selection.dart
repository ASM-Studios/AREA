import 'package:area/data/action.dart';
import 'package:area/data/service.dart';
import 'package:area/data/service_metadata.dart';
import 'package:area/pages/dashboard/action_selection_page.dart';
import 'package:area/services/about/about_service.dart';
import 'package:area/services/user/user_service.dart';
import 'package:flutter/material.dart';

class ServiceSelectionPage extends StatelessWidget {
  final Function(WorkflowActionReaction, WorkflowService) onActionSelected;
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
        future: AboutService.getAbout(),
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
                    onTap: () async {
                      final userInfos = await UserService.getUserInfos();

                      if (!userInfos.services.contains(services[index].name)) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text(
                                "Your account is not linked with this service. Please refer to your profile page to link this service."),
                            backgroundColor: Colors.red,
                          ),
                        );
                        return;
                      }
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => ActionSelectionPage(
                            service: services[index],
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
