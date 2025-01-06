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

.PHONY: start build stop restart reset logs clean fclean tests test_client_web test_client_mobile test_server test_client_web_watch coverage_client_web help start-server start-web start-mobile start-full build-server build-web build-mobile build-full restart-server restart-web restart-mobile restart-full reset-server reset-web reset-mobile reset-full

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
start: start-full

## Build and start containers in detached mode
build: build-full

## Stop all containers
stop:
	docker compose --profile full down
	docker compose --profile server down
	docker compose --profile web down
	docker compose --profile mobile down

## Restart all containers
restart: restart-full

## Reset containers, remove images and rebuild
reset: reset-full

## Show container logs
logs:
	docker compose --profile full logs -f

## Clean up containers, images and orphans
clean:
	docker compose --profile full down --rmi local --remove-orphans -v

## Clean up containers, images, volumes and orphans
fclean: clean
	docker system prune -af --volumes

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

## Start server only
start-server:
	docker compose --profile server up -d

## Start web client and server
start-web:
	docker compose --profile web up -d
	$(call check_health_and_report)

## Start all services (full mode)
start-full:
	docker compose --profile full up -d
	$(call check_health_and_report)

## Start mobile client and server
start-mobile:
	docker compose --profile mobile up -d

## Build and start server only
build-server:
	docker compose --profile server build

## Build and start web client and server
build-web:
	docker compose --profile web  build

## Build and start mobile client and server
build-mobile:
	docker compose --profile mobile build

## Build and start all services (full mode)
build-full:
	docker compose --profile full build

## Restart server only
restart-server: stop start-server

## Restart web client and server
restart-web: stop start-web

## Restart mobile client and server
restart-mobile: stop start-mobile

## Restart all services (full mode)
restart-full: stop start-full

## Reset and rebuild server only
reset-server: stop build-server start-server

## Reset and rebuild web client and server
reset-web: stop build-web start-web

## Reset and rebuild mobile client and server
reset-mobile: stop build-mobile start-mobile

## Reset and rebuild all services (full mode)
reset-full: stop build-full start-full






