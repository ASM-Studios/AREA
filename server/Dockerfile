FROM golang:1.23.4-alpine3.20 AS builder

RUN apk add --no-cache gcc musl-dev

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

FROM alpine:3.20.3

RUN apk add --no-cache ca-certificates && \
    adduser -D appuser

WORKDIR /app

COPY --from=builder /app/main .
COPY --from=builder /app/config.json .
COPY .env.server .env

RUN chown -R appuser:appuser /app && \
    chmod +x /app/main

USER appuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

CMD ["./main"]
