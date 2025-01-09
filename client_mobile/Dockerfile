FROM ghcr.io/cirruslabs/flutter:3.27.1 AS base

WORKDIR /app

RUN git config --global --add safe.directory /sdks/flutter

RUN flutter config --enable-web && \
    flutter doctor -v

RUN yes | sdkmanager --licenses

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]