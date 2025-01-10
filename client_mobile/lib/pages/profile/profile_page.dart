import 'package:area/services/user/user_service.dart';
import 'package:area/widgets/bind_oauth_buttons.dart';
import 'package:area/widgets/divider_with_text.dart';
import 'package:flutter/material.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: FutureBuilder(
          future: UserService.getUserInfos(),
          builder: (ctx, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting)
              return const Center(child: CircularProgressIndicator());

            if (snapshot.hasError) {
              return Center(
                child: Text('Erreur : ${snapshot.error}'),
              );
            }
            if (snapshot.hasData) {
              final userInfos = snapshot.data!;

              return Container(
                padding: EdgeInsets.all(15),
                child: Center(
                  child: Column(
                    children: [
                      Container(
                        padding: EdgeInsets.all(20),
                        decoration:
                            const ShapeDecoration(shape: CircleBorder()),
                        child: Image.asset(
                            width: 100,
                            height: 100,
                            "assets/images/profile.png"),
                      ),
                      Text(
                        "Hello ${userInfos.username}",
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 20),
                      DividerWithText(label: "Services connected"),
                      const SizedBox(height: 20),
                      BindOAuthButtons(servicesBinded: userInfos.services)
                    ],
                  ),
                ),
              );
            }
            return const Center(
              child: Text('No informations available'),
            );
          }),
    );
  }
}
