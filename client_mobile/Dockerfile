FROM ghcr.io/cirruslabs/flutter:3.27.1 AS base

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

RUN mkdir -p /app/build/app/outputs/flutter-apk && \
    flutter pub get && \
    flutter build apk --release && \
    mv /app/build/app/outputs/flutter-apk/app-release.apk /app/build/app/outputs/flutter-apk/client.apk

# Run web server in background and use tail to keep container alive
CMD flutter run -d web-server --web-port 8082 --web-hostname localhost & \
    tail -f /dev/null