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
        color: Colors.lightBlue,
        imagePath: 'assets/images/discord.png'),
    ServiceMetadata(
        name: "microsoft",
        color: Colors.grey,
        imagePath: 'assets/images/microsoft.png'),
    ServiceMetadata(
        name: "google",
        color: Colors.white,
        imagePath: 'assets/images/google.png'),
  ];

  static ServiceMetadata? getServiceByName(String name) {
    return services.firstWhere((service) => service.name == name);
  }
}
