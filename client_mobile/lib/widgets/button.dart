import 'package:flutter/material.dart';

class AreaButton extends StatelessWidget {
  const AreaButton(
      {super.key, required this.label, this.icon, this.onPressed, this.color});

  final String label;
  final IconData? icon;
  final void Function()? onPressed;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    return FilledButton(
      onPressed: onPressed ?? () {},
      style: ButtonStyle(
        backgroundColor: color != null
            ? WidgetStateProperty.all(color)
            : WidgetStateProperty.all(Theme.of(context).colorScheme.primary),
        shape: WidgetStatePropertyAll(
          RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(6.0),
          ),
        ),
        fixedSize: const WidgetStatePropertyAll(
          Size(double.infinity, 60),
        ),
      ),
      child: Center(
        child:
          Text(label,
              style: const TextStyle(
                fontFamily: "CoolveticaCondensed",
                fontSize: 24,
                color: Colors.white,
              )),
      ),
    );
  }
}
