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
FROM node:18-alpine AS app-builder

WORKDIR /app

# Copy certificates from cert-builder
COPY --from=cert-builder /localhost* ./

# Copy only package files first for better layer caching
COPY package*.json ./
RUN npm install

# Copy source files and build
COPY . .
RUN npm run build


###----------------------- Python tools stage -----------------------###
FROM alpine:3.19 AS tools-builder

# Install Python and tools
RUN apk add --no-cache \
    python3 \
    py3-virtualenv \
    py3-pip

# Setup Python environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip3 install --no-cache-dir sphinx sphinx_rtd_theme


###----------------------- Production stage -----------------------###
FROM nginx:alpine

# Create directory for mobile builds
RUN mkdir -p /usr/share/nginx/html/mobile_builds

# Copy production assets
COPY --from=app-builder /app/dist /usr/share/nginx/html
COPY --from=cert-builder /localhost* /etc/nginx/certs/
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create volume mount point for shared mobile builds
VOLUME /usr/share/nginx/html/mobile_builds

EXPOSE 8081

CMD ["nginx", "-g", "daemon off;"]
