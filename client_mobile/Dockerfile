FROM ghcr.io/cirruslabs/flutter:3.24.5 AS builder

WORKDIR /app

RUN useradd -m -d /home/flutteruser -s /bin/bash flutteruser && \
    chown -R flutteruser:flutteruser /app && \
    chown -R flutteruser:flutteruser /sdks/flutter && \
    chown -R flutteruser:flutteruser /opt/android-sdk-linux && \
    mkdir -p /opt/android-sdk-linux/licenses && \
    chown -R flutteruser:flutteruser /opt/android-sdk-linux/licenses

USER flutteruser

RUN flutter config --enable-web && \
    flutter doctor -v

COPY --chown=flutteruser:flutteruser . .

ARG API_URL
ARG WEB_CLIENT_URL
ARG MOBILE_CLIENT_URL
ARG GITHUB_CLIENT_ID
ARG GITHUB_CLIENT_SECRET

RUN yes | sdkmanager --licenses

CMD flutter pub get && \
    flutter run -d web-server --web-port 8082 --web-hostname 0.0.0.0 && \
    flutter build apk --release && \
    mv build/app/outputs/flutter-apk/app-release.apk build/app/outputs/flutter-apk/client.apk