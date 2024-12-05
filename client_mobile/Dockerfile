FROM ghcr.io/cirruslabs/flutter:3.24.5 AS builder

WORKDIR /app

RUN git config --system --add safe.directory /sdks/flutter && \
    git config --system --add safe.directory /app && \
    chmod -R 777 /sdks/flutter

COPY pubspec.* ./

RUN flutter pub get

COPY . .

ARG API_URL
ARG WEB_CLIENT_URL
ARG MOBILE_CLIENT_URL
ARG GITHUB_CLIENT_ID
ARG GITHUB_CLIENT_SECRET

RUN flutter build apk --release
RUN mv build/app/outputs/flutter-apk/app-release.apk build/app/outputs/flutter-apk/client.apk