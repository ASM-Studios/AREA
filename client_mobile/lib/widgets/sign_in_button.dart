import 'package:flutter/material.dart';

class SignInButton extends StatelessWidget {
  const SignInButton({
    super.key,
    required this.label,
    this.image,
    this.onPressed,
    this.activated = true,
  });

  final String label;
  final Image? image;
  final void Function()? onPressed;
  final bool activated;

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: (activated && onPressed != null) ? onPressed : () {},
      style: ButtonStyle(
        padding:
            const WidgetStatePropertyAll(EdgeInsets.fromLTRB(10, 10, 20, 10)),
        backgroundColor: WidgetStateProperty.all(
          activated ? Colors.white : Colors.grey[300],
        ),
        shape: WidgetStatePropertyAll(
          RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(30.0),
            side: BorderSide(
              color: activated
                  ? const Color.fromARGB(255, 221, 228, 222)
                  : Colors.grey,
              width: 1.5,
            ),
          ),
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          if (image != null) image!,
          Text(
            label,
            style: TextStyle(
              fontFamily: "CoolveticaCondensed",
              fontSize: 12,
              color: activated ? Colors.black : Colors.grey,
            ),
          ),
        ],
      ),
    );
  }
}
