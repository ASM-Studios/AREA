import 'package:flutter/material.dart';

class AreaFormField extends StatelessWidget {
  const AreaFormField(
      {super.key,
      required this.label,
      this.controller,
      this.initialValue,
      this.validator,
      this.keyboardType,
      this.isTextShown = true,
      this.enableSuggestions = true,
      this.autocorrect = false,
      this.readOnly = false,
      this.suffixIcon,
      this.maxLines,
      this.onTap,
      this.onChanged});

  final String label;
  final String? initialValue;
  final TextEditingController? controller;
  final String? Function(String?)? validator;
  final TextInputType? keyboardType;
  final bool isTextShown;
  final bool enableSuggestions;
  final bool autocorrect;
  final int? maxLines;
  final bool readOnly;
  final Widget? suffixIcon;
  final void Function()? onTap;
  final void Function(String)? onChanged;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      child: TextFormField(
        keyboardType: keyboardType,
        maxLines: maxLines ?? 1,
        onChanged: onChanged,
        initialValue: controller != null ? null : initialValue,
        controller: controller,
        validator: validator,
        style: TextStyle(
          fontSize: 18,
          fontFamily: 'MulishSemiBold',
          color: Theme.of(context).colorScheme.onSurface,
        ),
        decoration: InputDecoration(
          hintText: label,
          border: const OutlineInputBorder(),
          enabledBorder: const OutlineInputBorder(
            borderSide: BorderSide(
              color: Colors.black,
              // color: Color.fromARGB(255, 221, 228, 222),
              width: 1.0,
            ),
          ),
          suffixIcon: suffixIcon,
        ),
        obscureText: !isTextShown,
        enableSuggestions: enableSuggestions,
        autocorrect: autocorrect,
        readOnly: readOnly,
        onTap: onTap,
      ),
    );
  }
}
