import 'package:flutter/material.dart';

class DateTimePicker extends StatefulWidget {
  const DateTimePicker(
      {super.key, required this.label, required this.onDateSelected});

  final String label;
  final Function(String) onDateSelected;

  @override
  State<DateTimePicker> createState() => _DateTimePickerState();
}

class _DateTimePickerState extends State<DateTimePicker> {
  String value = "";
  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () async {
        DateTime? pickedDate = await showDatePicker(
          context: context,
          initialDate: DateTime.now(),
          firstDate: DateTime(2000),
          lastDate: DateTime(2100),
        );
        if (pickedDate != null) {
          widget.onDateSelected(pickedDate.toIso8601String());
          value = pickedDate.toIso8601String();
        }
      },
      child: InputDecorator(
        decoration: InputDecoration(
          labelText: widget.label,
          border: const OutlineInputBorder(),
          suffixIcon: const Icon(Icons.calendar_today),
        ),
        child: Text(value.isNotEmpty ? value : 'Select a date'),
      ),
    );
  }
}
