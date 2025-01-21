import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

class ShimmerServiceTemplate extends StatelessWidget {
  const ShimmerServiceTemplate({super.key});

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: Colors.grey[300]!,
      highlightColor: Colors.grey[100]!,
      child: Container(
        width: 150,
        height: 160,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
        ),
      ),
    );
  }
}

class ShimmerServicesLoader extends StatelessWidget {
  const ShimmerServicesLoader({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(15),
      child: Center(
        child: Column(
          children: [
            Row(
              children: [
                ShimmerServiceTemplate(),
                const Spacer(),
                ShimmerServiceTemplate(),
              ],
            ),
            const SizedBox(height: 30),
            Row(
              children: [
                ShimmerServiceTemplate(),
                const Spacer(),
                ShimmerServiceTemplate(),
              ],
            ),
            const SizedBox(height: 30),
            Row(
              children: [
                ShimmerServiceTemplate(),
                const Spacer(),
                ShimmerServiceTemplate(),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
