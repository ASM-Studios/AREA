import 'package:flutter/material.dart';

class SmallClickableText extends StatelessWidget {
  const SmallClickableText(this.title, {super.key, this.onPressed, this.color});

  final String title;
  final void Function()? onPressed;
  final Color ?color;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onPressed,
      child: Text(
        title,
        style: TextStyle(
          fontSize: 16,
          fontFamily: 'MulishSemiBold',
          decoration: TextDecoration.underline,
          decorationColor: color ?? const Color(0xFFAEAED7),
          color: color ?? const Color(0xFFAEAED7),
        ),
      ),
    );
  }
}
