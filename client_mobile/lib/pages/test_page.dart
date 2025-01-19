import 'dart:math';

import 'package:area/pages/auth/login.dart';
import 'package:area/services/oauth/oauth_service.dart';
import 'package:flutter/material.dart';
import 'package:simple_animations/animation_builder/custom_animation_builder.dart';

class TestPage extends StatefulWidget {
  const TestPage({super.key});

  @override
  State<TestPage> createState() => _TestPageState();
}

class ParticleBackgroundScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          Positioned.fill(child: AnimatedParticleBackground()),
          // Center(
            // child: Text(
              // 'Fond avec Particules',
              // style: TextStyle(
                // color: Colors.white,
                // fontSize: 32,
                // fontWeight: FontWeight.bold,
              // ),
            // ),
          // ),
        ],
      ),
    );
  }
}

class AnimatedParticleBackground extends StatefulWidget {
  @override
  _AnimatedParticleBackgroundState createState() =>
      _AnimatedParticleBackgroundState();
}

class _AnimatedParticleBackgroundState
    extends State<AnimatedParticleBackground> {
  final Random random = Random();
  final List<ParticleModel> particles = [];

  @override
  void initState() {
    super.initState();
    _initParticles();
  }

  void _initParticles() {
    for (var i = 0; i < 50; i++) {
      particles.add(ParticleModel(random));
    }
  }

  @override
  Widget build(BuildContext context) {
    return CustomAnimationBuilder<double>(
      control: Control.loop,
      tween: Tween(begin: 0.0, end: 1.0),
      duration: Duration(seconds: 20),
      builder: (context, value, child) {
        _updateParticles();
        return CustomPaint(
          painter: ParticlePainter(particles),
        );
      },
    );
  }

  void _updateParticles() {
    particles.forEach((particle) => particle.update());
  }
}

class ParticleModel {
  late Animatable tween;
  late double size;
  late double speed;
  late double x;
  late double y;
  final Random random;

  ParticleModel(this.random) {
    restart();
  }

  void restart() {
    x = random.nextDouble();
    y = random.nextDouble();
    size = 0.002 + random.nextDouble() * 0.004;
    speed = 0.001 + random.nextDouble() * 0.002;

    tween = Tween<double>(begin: 0, end: 1).chain(CurveTween(curve: Curves.linear));
  }

  void update() {
    y -= speed;
    if (y < 0) {
      restart();
      y = 1.0;
    }
  }
}

class ParticlePainter extends CustomPainter {
  final List<ParticleModel> particles;

  ParticlePainter(this.particles);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = Colors.black.withOpacity(0.5);

    particles.forEach((particle) {
      final position = Offset(
        particle.x * size.width,
        particle.y * size.height,
      );
      canvas.drawCircle(position, size.width * particle.size, paint);
    });
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => true;
}

class ActionSelectionPage extends StatelessWidget {
  const ActionSelectionPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final List<String> actions = [
      "Play/Pause a track",
      "Skip to the previous track",
      "Skip to the next track",
      "Add track to a playlist",
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Select Action/Reaction',
          style: TextStyle(
            color: Colors.black,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.black),
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: actions.length,
        separatorBuilder: (context, index) => const Divider(
          color: Colors.black12,
          thickness: 0.5,
        ),
        itemBuilder: (context, index) {
          return ListTile(
            title: Text(
              actions[index],
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w500,
              ),
            ),
            trailing: const Icon(Icons.arrow_forward_ios, color: Colors.black, size: 18),
            onTap: () {
              // Ajouter une action ici
              print("Selected: ${actions[index]}");
            },
          );
        },
      ),
    );
  }
}

class _TestPageState extends State<TestPage> {
  @override
  Widget build(BuildContext context) {
    // return ParticleBackgroundScreen();
    return ActionSelectionPage();
    // return Scaffold(
    //   body: Center(
    //     child: ElevatedButton(
    //       onPressed: () async {
    //         OAuthService.requestOAuth(context, "google");
    //       },
    //       child: const Text("google"),
    //     ),
    //   ),
    // );
  }
}
