import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

class ShimmerWorkflowTemplate extends StatelessWidget {
  const ShimmerWorkflowTemplate({super.key});

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: Colors.grey[300]!,
      highlightColor: Colors.grey[100]!,
      child: Container(
        width: double.infinity,
        height: 90,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius:
              BorderRadius.circular(20),
        ),
      ),
    );
  }
}

class ShimmerWorkflowLoader extends StatelessWidget {
  const ShimmerWorkflowLoader({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(10),
      child: Center(
        child: Column(
          children: [
            const SizedBox(height: 20),
            ShimmerWorkflowTemplate(),
            const SizedBox(height: 10),
            ShimmerWorkflowTemplate(),
            const SizedBox(height: 10),
            ShimmerWorkflowTemplate(),
            const SizedBox(height: 10),
            ShimmerWorkflowTemplate(),
            const SizedBox(height: 10),
            ShimmerWorkflowTemplate(),
          ],
        ),
      ),
    );
  }
}
