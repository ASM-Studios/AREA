import 'package:area/animations/loading/workflow/shimmer_workflow_loader.dart';
import 'package:area/data/workflow.dart';
import 'package:area/services/workflow/workflow_service.dart';
import 'package:area/widgets/profile_button.dart';
import 'package:area/widgets/workflow_container.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

class WorkflowListPage extends StatefulWidget {
  const WorkflowListPage({super.key});

  @override
  State<WorkflowListPage> createState() => _WorkflowListPageState();
}

class _WorkflowListPageState extends State<WorkflowListPage> {
  List<Workflow> workflows = [];

   void removeWorkflow(int id) {
    setState(() {
      workflows.removeWhere((workflow) => workflow.id == id);
    });
  }

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
            future: UpdateWorkflowService.getWorkflowList(),
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const ShimmerWorkflowLoader();
              }
              if (snapshot.hasError) {
                return Center(
                  child: Text('Erreur : ${snapshot.error}'),
                );
              }

              if (snapshot.hasData) {
                workflows = snapshot.data!;

                return Expanded(
                  child: workflows.isNotEmpty
                      ? GridView.builder(
                          itemCount: workflows.length,
                          gridDelegate:
                              const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 1,
                            crossAxisSpacing: 8.0,
                            mainAxisSpacing: 8.0,
                            childAspectRatio: 2.0,
                          ),
                          itemBuilder: (ctx, index) => WorkflowContainer(
                            workflow: workflows[index],
                            onRemove: removeWorkflow,
                          ),
                        )
                      : Center(
                          child: Text(
                            "No workflow available",
                            style: GoogleFonts.fjallaOne(
                              textStyle: const TextStyle(
                                  color: Colors.black, fontSize: 14),
                            ),
                          ),
                        ),
                );
              }
              return const Center(child: Text('No workflow available'));
            },
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          context.push("/workflow/create");
        },
        tooltip: 'Ajouter',
        child: Icon(Icons.add),
      ),
    );
  }
}
