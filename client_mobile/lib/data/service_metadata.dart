import 'package:flutter/material.dart';

class ServiceMetadata {
  final String name;
  final Color color;
  final String imagePath;

  ServiceMetadata({
    required this.name,
    required this.color,
    required this.imagePath,
  });

  static List<ServiceMetadata> services = [
    ServiceMetadata(
        name: "spotify",
        color: Colors.green,
        imagePath: 'assets/images/spotify.png'),
    ServiceMetadata(
        name: "discord",
        color: Color(0xFF7785cc),
        imagePath: 'assets/images/discord.png'),
    ServiceMetadata(
        name: "microsoft",
        color: Colors.white,
        imagePath: 'assets/images/microsoft.png'),
    ServiceMetadata(
        name: "google",
        color: Colors.white,
        imagePath: 'assets/images/google.png'),
    ServiceMetadata(
        name: "github",
        color: Colors.white,
        imagePath: 'assets/images/github.png'),
    ServiceMetadata(
        name: "twitch",
        color: Colors.purple,
        imagePath: 'assets/images/twitch_white.png'),
  ];

  static ServiceMetadata? getServiceByName(String name) {
    return services.firstWhere((service) => service.name == name);
  }
}
