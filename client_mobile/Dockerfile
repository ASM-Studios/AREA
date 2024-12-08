FROM ghcr.io/cirruslabs/flutter:3.24.5 AS builder

WORKDIR /app

# Create a non-root user and give permissions to Android SDK directory
RUN useradd -m -d /home/flutteruser -s /bin/bash flutteruser && \
    chown -R flutteruser:flutteruser /app && \
    chown -R flutteruser:flutteruser /sdks/flutter && \
    chown -R flutteruser:flutteruser /opt/android-sdk-linux && \
    mkdir -p /opt/android-sdk-linux/licenses && \
    chown -R flutteruser:flutteruser /opt/android-sdk-linux/licenses

USER flutteruser

RUN git config --global --add safe.directory /sdks/flutter && \
    git config --global --add safe.directory /app

# Ensure Flutter is properly set up
RUN flutter doctor -v && \
    flutter config --no-analytics

COPY --chown=flutteruser:flutteruser pubspec.* ./

RUN flutter pub get

COPY --chown=flutteruser:flutteruser . .

ARG API_URL
ARG WEB_CLIENT_URL
ARG MOBILE_CLIENT_URL
ARG GITHUB_CLIENT_ID
ARG GITHUB_CLIENT_SECRET

# Accept Android licenses and install SDK components
RUN yes | sdkmanager --licenses && \
    sdkmanager "build-tools;30.0.3"

# Clean and get dependencies again after copying all files
RUN flutter clean && \
    flutter pub get

RUN flutter build apk --release
RUN mv build/app/outputs/flutter-apk/app-release.apk build/app/outputs/flutter-apk/client.apk