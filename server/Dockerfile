FROM golang:1.23.3-alpine as builder
WORKDIR /app

COPY . .
RUN go mod tidy
RUN go mod download
RUN go get -u github.com/swaggo/swag
RUN go get -u github.com/gin-gonic/gin
RUN go build -o main .


FROM debian:bullseye-slim

WORKDIR /app
COPY --from=builder /app/main .
COPY --from=builder /app/.env .
COPY --from=builder /app/config.json .

RUN chmod +x /app/main

EXPOSE 8080
CMD ["./main"]
