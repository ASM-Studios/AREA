# Colors
GREEN  := \033[0;32m
YELLOW := \033[0;33m
WHITE  := \033[0;37m
RESET  := \033[0m

# Target help text
TARGET_MAX_CHAR_NUM=20

.PHONY: start build stop restart reset logs clean help start-server start-web start-mobile start-full build-server build-web build-mobile build-full restart-server restart-web restart-mobile restart-full reset-server reset-web reset-mobile reset-full

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

## Restart all containers
restart: restart-full

## Reset containers, remove images and rebuild
reset: reset-full

## Show container logs
logs:
	docker compose logs -f

## Clean up containers, images, volumes and orphans
clean:
	docker compose --profile full down --remove-orphans -v
	-docker rmi -f $$(docker images -q) || true
	docker builder prune -af
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

## Start mobile client and server
start-mobile:
	docker compose --profile mobile up -d

## Build and start server only
build-server:
	docker compose --profile server up --build -d

## Build and start web client and server
build-web:
	docker compose --profile web up --build -d

## Build and start mobile client and server
build-mobile:
	docker compose --profile mobile up --build -d

## Restart server only
restart-server: stop
	docker compose --profile server up -d

## Restart web client and server
restart-web: stop
	docker compose --profile web up -d

## Restart mobile client and server
restart-mobile: stop
	docker compose --profile mobile up -d

## Reset and rebuild server only
reset-server:
	docker compose --profile server down
	docker compose --profile server up --build -d

## Reset and rebuild web client and server
reset-web:
	docker compose --profile web down
	docker compose --profile web up --build -d

## Reset and rebuild mobile client and server
reset-mobile:
	docker compose --profile mobile down
	docker compose --profile mobile up --build -d

## Start all services (full mode)
start-full:
	docker compose --profile full up -d

## Build and start all services (full mode)
build-full:
	docker compose --profile full up --build -d

## Restart all services (full mode)
restart-full: stop
	docker compose --profile full up -d

## Reset and rebuild all services (full mode)
reset-full:
	docker compose --profile full down
	docker compose --profile full up --build -d
