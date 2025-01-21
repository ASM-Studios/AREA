import 'package:area/widgets/form_field.dart';
import 'package:flutter/material.dart';

class PasswordFormField extends StatefulWidget {
  const PasswordFormField({
    super.key,
    this.label = "Mot de passe",
    this.controller,
    this.validator,
  });

  final String label;
  final TextEditingController? controller;
  final String? Function(String?)? validator;

  @override
  State<PasswordFormField> createState() => _PasswordFormFieldState();
}

class _PasswordFormFieldState extends State<PasswordFormField> {
  bool viewPwd = false;

  @override
  Widget build(BuildContext context) {
    return AreaFormField(
        label: widget.label,
        controller: widget.controller,
        isTextShown: viewPwd,
        enableSuggestions: false,
        autocorrect: false,
        suffixIcon: IconButton(
            icon: Icon(viewPwd ? Icons.visibility : Icons.visibility_off),
            onPressed: () {
              setState(() {
                viewPwd = !viewPwd;
              });
            }),
        validator: (value) {
          if (value == null || value.isEmpty) {
            return 'Please input your password.';
          }
          if (widget.validator != null) {
            return widget.validator!.call(value);
          }
          return null;
        });
  }
}
