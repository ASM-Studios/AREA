###----------------------- Certificate generation stage -----------------------###
FROM alpine:3.19 AS cert-builder

# Install mkcert dependencies
RUN apk add --no-cache \
    curl \
    nss \
    nss-tools

# Install mkcert
RUN curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64" \
    && chmod +x mkcert-v*-linux-amd64 \
    && mv mkcert-v*-linux-amd64 /usr/local/bin/mkcert \
    && mkcert -install \
    && mkcert localhost


###----------------------- Build stage for Node.js application -----------------------###
FROM node:latest AS builder

WORKDIR /app

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

COPY ./package*.json ./
RUN npm install
COPY . .

RUN npm run build


###----------------------- Production stage -----------------------###
FROM nginx:alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
RUN mkdir -p /usr/share/nginx/html/mobile_builds

EXPOSE ${VITE_PORT}

CMD ["nginx", "-g", "daemon off;"]