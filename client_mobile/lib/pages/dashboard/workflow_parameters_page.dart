import 'package:area/data/parameter.dart';
import 'package:area/widgets/button.dart';
import 'package:area/widgets/datetime_picker.dart';
import 'package:flutter/material.dart';
import 'package:area/data/action.dart';
import 'package:google_fonts/google_fonts.dart';

class WorkflowParametersPage extends StatefulWidget {
  const WorkflowParametersPage({super.key, required this.action});

  final WorkflowActionReaction action;

  @override
  State<WorkflowParametersPage> createState() => _WorkflowParametersPageState();
}

class _WorkflowParametersPageState extends State<WorkflowParametersPage> {
  final Map<String, String> _parameterValues = {};

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          title: Text(
        "Configure Parameters",
        style: const TextStyle(
            color: Colors.black, fontSize: 24, fontWeight: FontWeight.bold),
      )),
      body: Column(
        children: [
          Expanded(
            child: Scrollbar(
              thickness: 6,
              radius: const Radius.circular(10),
              thumbVisibility: true,
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    ...widget.action.parameters.map(
                      (parameter) => Padding(
                        padding: const EdgeInsets.symmetric(vertical: 10.0),
                        child: _buildParameterWidget(parameter),
                      ),
                    ),
                    const SizedBox(height: 40),
                  ],
                ),
              ),
            ),
          ),
          Padding(
            padding: EdgeInsets.all(20),
            // padding: EdgeInsets.fromLTRB(50, 20, 50, 20),
            child: AreaButton(
              label: "Submit",
              onPressed: _submitParameters,
              color: const Color(0XFF035a63),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildParameterWidget(Parameter parameter) {
    switch (parameter.type) {
      case "string":
        return TextField(
          decoration: InputDecoration(
            labelText: parameter.name,
            border: const OutlineInputBorder(),
          ),
          onChanged: (value) {
            _parameterValues[parameter.name] = value;
          },
        );
      case "boolean":
        return DropdownButtonFormField<String>(
          decoration: InputDecoration(
            labelText: parameter.name,
            border: const OutlineInputBorder(),
          ),
          items: const [
            DropdownMenuItem(value: "true", child: Text("True")),
            DropdownMenuItem(value: "false", child: Text("False")),
          ],
          onChanged: (value) {
            _parameterValues[parameter.name] = value ?? "false";
          },
          value: _parameterValues[parameter.name] ?? "false",
        );
      case "datetime":
        return DateTimePicker(
          label: parameter.name,
          onDateSelected: (selectedDate) {
            setState(() {
              _parameterValues[parameter.name] = selectedDate;
            });
          },
        );
      default:
        return TextField(
          decoration: InputDecoration(
            labelText: parameter.name,
            border: const OutlineInputBorder(),
          ),
          onChanged: (value) {
            _parameterValues[parameter.name] = value;
          },
        );
    }
  }

  void _submitParameters() {
    for (var param in widget.action.parameters) {
      param.value = _parameterValues[param.name];
    }
    Navigator.of(context).pop(widget.action);
  }
}
