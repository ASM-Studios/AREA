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

###----------------------- Build stage -----------------------###
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN if [ "$NODE_ENV" = "production" ] ; then npm ci ; else npm install ; fi

COPY . .

RUN if [ "$NODE_ENV" = "production" ] ; then npm run build ; fi

###----------------------- Production stage -----------------------###
FROM nginx:1.25.3-alpine AS production

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

###----------------------- Development stage -----------------------###
FROM builder AS development

RUN apk add --no-cache \
    nss-tools \
    curl \
    && curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64" \
    && chmod +x mkcert-v*-linux-amd64 \
    && cp mkcert-v*-linux-amd64 /usr/local/bin/mkcert

ENV NODE_ENV=development
EXPOSE ${VITE_PORT}

CMD ["sh", "-c", "if [ ! -f localhost-key.pem ]; then mkcert -install && mkcert localhost; fi && mv localhost*.pem /app/ && npm run dev -- --host"]