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

ARG API_URL
ARG WEB_CLIENT_URL
ARG MOBILE_CLIENT_URL
ARG GITHUB_CLIENT_ID
ARG GITHUB_CLIENT_SECRET

RUN yes | sdkmanager --licenses

# Create a script to handle both development and production modes
COPY --chown=flutteruser:flutteruser docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]