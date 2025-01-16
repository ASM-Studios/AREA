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

###----------------------- Development stage -----------------------###
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY public/ ./public/

RUN npm install

RUN apk add --no-cache \
    nss-tools \
    curl \
    && for i in $(seq 1 5); do \
    curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64" && break || \
    if [ $i -eq 5 ]; then exit 1; fi && \
    echo "Attempt $i failed! Retrying in 15 seconds..." && \
    sleep 15; \
    done \
    && chmod +x mkcert-v*-linux-amd64 \
    && cp mkcert-v*-linux-amd64 /usr/local/bin/mkcert

ENV NODE_ENV=development
EXPOSE ${VITE_PORT}

CMD ["sh", "-c", "if [ ! -f localhost-key.pem ]; then mkcert -install && mkcert localhost; fi && mv localhost*.pem /app/ && npm run dev -- --host"]