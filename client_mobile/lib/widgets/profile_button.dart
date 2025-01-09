import 'package:client_mobile/services/login/auth_service.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class ProfileButton extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return PopupMenuButton<String>(
      onSelected: (value) async {
        if (value == 'parametres') {
          print('Paramètres sélectionnés');
          context.push("/profile");
        } else if (value == 'deconnexion') {
          bool hasLogout = await AuthService.logout();
          if (hasLogout) context.pushReplacement("/login");
          print('User logging out');
        }
      },
      itemBuilder: (BuildContext context) {
        return [
          PopupMenuItem<String>(
            value: 'parametres',
            child: Text('Paramètres'),
          ),
          PopupMenuItem<String>(
            value: 'deconnexion',
            child: Text('Déconnexion', style: TextStyle(color: Colors.red)),
          ),
        ];
      },
      style: ButtonStyle(),
      icon: Icon(Icons.person, size: 32),
    );
  }
}