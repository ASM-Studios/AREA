import 'package:client_mobile/data/workflow.dart';
import 'package:client_mobile/services/about/about_service.dart';
import 'package:client_mobile/widgets/profile_button.dart';
import 'package:client_mobile/widgets/workflow_container.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class WorkflowListPage extends StatelessWidget {
  const WorkflowListPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(0, 30, 20, 0),
            child: Align(alignment: Alignment.topRight, child: ProfileButton()),
          ),
          Center(
            child: Text(
              'YOUR WORKFLOWS',
              style: GoogleFonts.fjallaOne(
                textStyle: const TextStyle(color: Colors.black, fontSize: 24),
              ),
            ),
          ),
          FutureBuilder(
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
                final workflows = snapshot.data!;

                return Expanded(
                  child: GridView.builder(
                    itemCount: 5,
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 1,
                      crossAxisSpacing: 8.0,
                      mainAxisSpacing: 8.0,
                      childAspectRatio: 2.0,
                    ),
                    itemBuilder: (ctx, index) => WorkflowContainer(workflow: Workflow(description: "tqt", name: "Oui", servicesId: [], events: []),),
                  ),
                );
              }
              return const Center(child: Text('No workflow available'));
            },
          ),
        ],
      ),
    );
  }
}
