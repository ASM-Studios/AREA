import 'package:flutter/material.dart';

class SignInButton extends StatelessWidget {
  const SignInButton(
      {super.key, required this.label, this.image, this.onPressed});

  final String label;
  final Image? image;
  final void Function()? onPressed;

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
        onPressed: onPressed ?? () {},
        style: ButtonStyle(
          padding: const WidgetStatePropertyAll(EdgeInsets.fromLTRB(10, 10, 20, 10)),
          backgroundColor: WidgetStateProperty.all(Colors.white),
          shape: WidgetStatePropertyAll(
            RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(30.0),
              side: const BorderSide(
                color: Color.fromARGB(255, 221, 228, 222),
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
              style: const TextStyle(
                fontFamily: "CoolveticaCondensed",
                fontSize: 12,
                color: Colors.black,
              ),
            ),
          ],
        ),
      );
  }
}
