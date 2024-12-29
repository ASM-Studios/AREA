# Env vars
VITE_PORT := 8081

# Colors
GREEN  := \033[0;32m
YELLOW := \033[0;33m
WHITE  := \033[0;37m
RESET  := \033[0m

# Target help text
TARGET_MAX_CHAR_NUM=20

define check_health_and_report
	@echo "Waiting for services to be healthy..."
	@timeout 60 sh -c 'until docker compose ps | grep -q "healthy"; do sleep 1; done' || (echo "❌ Services failed to start properly" && exit 1)
	@if [ "$$(docker compose ps | grep -c "healthy")" -eq 4 ]; then \
		echo "\n🚀 All services are up and running!"; \
		echo "📱 Web client is available at: https://localhost:${VITE_PORT}"; \
		echo "⚙️  API is available at: http://localhost:8080"; \
		echo "🐰 RabbitMQ management UI is available at: http://localhost:15672\n"; \
	else \
		echo "❌ Some services are not healthy"; \
		docker compose ps; \
		exit 1; \
	fi
endef

.PHONY: start build stop restart reset logs clean help

PROJECT_IMAGES = area-client-web area-client-mobile area-server mariadb rabbitmq

## Show help
help:
	@printf '\n'
	@printf 'Usage:\n'
	@printf '  $(YELLOW)make$(RESET) $(GREEN)<target>$(RESET)\n'
	@printf '\n'
	@printf 'Targets:\n'
	@awk '/^[a-zA-Z\-\_0-9]+:/ { \
		helpMessage = match(lastLine, /^## (.*)/); \
		if (helpMessage) { \
			helpCommand = substr($$1, 0, index($$1, ":")-1); \
			helpMessage = substr(lastLine, RSTART + 3, RLENGTH); \
			printf "  $(YELLOW)%-$(TARGET_MAX_CHAR_NUM)s$(RESET) $(GREEN)%s$(RESET)\n", helpCommand, helpMessage; \
		} \
	} \
	{ lastLine = $$0 }' $(MAKEFILE_LIST)
	@printf '\n'

## Start containers in detached mode
start:
	docker compose up -d
	$(call check_health_and_report)

## Start containers in detached mode for production
start-prod:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
	$(call check_health_and_report)

## Build and start containers in detached mode
build:
	docker compose up --build -d
	$(call check_health_and_report)

## Stop all containers
stop:
	docker compose down

## Restart all containers
restart: stop start
	$(call check_health_and_report)

## Reset containers, remove images and rebuild
reset:
	docker compose down
	docker rmi $(PROJECT_IMAGES) -f
	docker compose up --build -d
	$(call check_health_and_report)

## Show container logs
logs:
	docker compose logs -f

## Clean up containers, images, volumes and orphans
clean:
	docker compose down --rmi local -v --remove-orphans

## Run all tests
tests: test_client_web test_client_mobile test_server

## Run tests for client_web
test_client_web:
	cd client_web && npm run test && cd ..

## Run test:watcher for client_web
test_client_web_watch:
	cd client_web && npm run test:watch && cd ..

## Run test:coverage for client_web
coverage_client_web:
	cd client_web && npm run test:coverage && cd ..

## Run tests for client_mobile
test_client_mobile:
	@echo "test_client_mobile::not implemented yet"

## Run tests for server
test_server:
	@echo "test_server::not implemented yet"
