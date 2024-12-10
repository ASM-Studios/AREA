import 'package:client_mobile/pages/dashboard/service_connection.dart';
import 'package:client_mobile/pages/dashboard/workflow.dart';
import 'package:flutter/material.dart';

class DashboardPage extends StatefulWidget {
  @override
  _DashboardPageState createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  int _currentIndex = 0; // Pour suivre l'index actuel

  final List<Widget> _pages = [
    WorkflowPage(), // Votre page actuelle avec les boutons Action et Réaction
    ServiceConnectionPage(), // Une nouvelle page pour la connexion des services
  ];

  void _onTabTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _pages[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: _onTabTapped,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings),
            label: 'Services',
          ),
        ],
      ),
    );
  }
}