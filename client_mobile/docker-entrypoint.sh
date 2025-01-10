#!/bin/bash

echo "Generating launcher icons..."
flutter pub run flutter_launcher_icons

echo "Getting dependencies..."
flutter pub get

echo "Building APK..."
mkdir -p /app/build/app/outputs/flutter-apk
flutter build apk --release
mv /app/build/app/outputs/flutter-apk/app-release.apk /app/build/app/outputs/flutter-apk/client.apk

echo "Starting development server..."
flutter run -d web-server --web-port 8082 --web-hostname 0.0.0.0 --debug 