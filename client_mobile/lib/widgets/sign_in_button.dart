import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class SignInButton extends StatelessWidget {
  const SignInButton(
      {super.key, required this.label, this.image, this.onPressed});

  final String label;
  final Image? image;
  final void Function()? onPressed;

  @override
  Widget build(BuildContext context) {
    return FractionallySizedBox(
      widthFactor: 0.6,
      child: FilledButton(
        onPressed: onPressed ?? () {},
        style: ButtonStyle(
          padding: const WidgetStatePropertyAll(EdgeInsets.all(10)),
          backgroundColor: WidgetStateProperty.all(Colors.white),
          shape: WidgetStatePropertyAll(
            RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(6.0),
              side: const BorderSide(
                color: Color.fromARGB(255, 221, 228,
                    222), // Couleur de la bordure lorsque le champ est actif
                width: 2.0, // Largeur de la bordure
              ),
            ),
          ),
          fixedSize: const WidgetStatePropertyAll(
            Size(double.infinity, 80),
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            if (image != null) image!,
            // const SizedBox(width: 5),
            Text(label,
                style: const TextStyle(
                  fontFamily: "CoolveticaCondensed",
                  fontSize: 12,
                  color: Colors.black,
                )),
          ],
        ),
      ),
    );
  }
}
