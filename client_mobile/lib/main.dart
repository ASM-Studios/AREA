import 'dart:io';
import 'package:client_mobile/features/auth/login.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

Future<void> main() async {
  await dotenv.load(fileName: ".env");
  runApp(SpotifyOAuthApp());
}
