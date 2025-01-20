import 'package:area/animations/loading/profile/shimmer_profile_loader.dart';
import 'package:area/config/settings_config.dart';
import 'package:area/config/translation_config.dart';
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
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const ShimmerProfileLoader();
            }
            if (snapshot.hasError) {
              return Center(
                child: Text('${snapshot.error}'),
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
                        "${TranslationConfig.translate(
                          "hello",
                          language: SettingsConfig.language,
                        )} ${userInfos.username}",
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 20),
                      DividerWithText(
                        label: TranslationConfig.translate(
                          "services_connected",
                          language: SettingsConfig.language,
                        ),
                      ),
                      const SizedBox(height: 20),
                      BindOAuthButtons(servicesBinded: userInfos.services)
                    ],
                  ),
                ),
              );
            }
            return Center(
              child: Text(TranslationConfig.translate(
              "informations_error",
              language: SettingsConfig.language,
            )),
            );
          }),
    );
  }
}
