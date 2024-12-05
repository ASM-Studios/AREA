###----------------------- Certificate generation stage -----------------------###
FROM alpine:3.20.3 AS cert-builder

RUN apk add --no-cache openssl
RUN mkdir -p /etc/nginx/ssl && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/private.key \
    -out /etc/nginx/ssl/certificate.crt \
    -subj "/C=FR/ST=Paris/L=Paris/O=Area/OU=IT/CN=localhost" \
    -addext "subjectAltName = DNS:localhost" && \
    chmod 644 /etc/nginx/ssl/certificate.crt /etc/nginx/ssl/private.key


###----------------------- Build stage for Node.js application -----------------------###
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_PORT
ARG VITE_ENDPOINT
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_GOOGLE_CLIENT_SECRET
ARG VITE_MICROSOFT_CLIENT_ID
ARG VITE_LINKEDIN_CLIENT_ID
ARG VITE_LINKEDIN_CLIENT_SECRET
ARG VITE_SPOTIFY_CLIENT_ID
ARG VITE_SPOTIFY_CLIENT_SECRET
ARG API_URL
ARG WEB_CLIENT_URL
ARG MOBILE_CLIENT_URL
ARG GITHUB_CLIENT_ID
ARG GITHUB_CLIENT_SECRET

RUN npm run build


###----------------------- Production stage -----------------------###
FROM nginx:1.25.3-alpine

ARG VITE_PORT

RUN adduser -D nginxuser && \
    mkdir -p /usr/share/nginx/html/mobile_builds && \
    mkdir -p /etc/nginx/ssl && \
    chown -R nginxuser:nginxuser /usr/share/nginx/html && \
    chown -R nginxuser:nginxuser /etc/nginx/ssl && \
    chown -R nginxuser:nginxuser /var/cache/nginx && \
    chown -R nginxuser:nginxuser /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginxuser:nginxuser /var/run/nginx.pid

COPY --from=cert-builder --chown=nginxuser:nginxuser /etc/nginx/ssl /etc/nginx/ssl
COPY --from=builder --chown=nginxuser:nginxuser /app/dist /usr/share/nginx/html
COPY --chown=nginxuser:nginxuser ./nginx.conf /etc/nginx/conf.d/default.conf

USER nginxuser

EXPOSE ${VITE_PORT}

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:${VITE_PORT}/health || exit 1

CMD ["nginx", "-g", "daemon off;"]