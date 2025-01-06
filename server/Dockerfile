# Development stage
FROM golang:1.23.4-alpine AS development

WORKDIR /app

RUN apk add --no-cache wget git

RUN go install github.com/air-verse/air@latest

COPY go.mod go.sum ./
RUN go mod download

COPY . .

EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

RUN mkdir -p tmp && chmod -R 777 tmp

VOLUME ["/app"]

CMD ["air", "-c", ".air.toml"]
