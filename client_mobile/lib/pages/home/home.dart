import 'package:area/services/login/auth_service.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  @override
  void initState() {
    super.initState();
    redirect();
  }

  void redirect() async {
    if (await AuthService.isUserLogin()) {
      context.pushReplacement("/workflow/list");
    } else {
      context.pushReplacement("/login");
    }
  }

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: CircularProgressIndicator(),
    );
  }
}
