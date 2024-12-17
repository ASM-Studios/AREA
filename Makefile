# Colors
GREEN  := \033[0;32m
YELLOW := \033[0;33m
WHITE  := \033[0;37m
RESET  := \033[0m

# Target help text
TARGET_MAX_CHAR_NUM=20

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

## Start containers in detached mode for production
start-prod:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

## Build and start containers in detached mode
build:
	docker compose up --build -d

## Stop all containers
stop:
	docker compose down

## Restart all containers
restart: stop start

## Reset containers, remove images and rebuild
reset:
	docker compose down
	docker rmi $(PROJECT_IMAGES) -f
	docker compose up --build -d

## Show container logs
logs:
	docker compose logs -f

## Clean up containers, images, volumes and orphans
clean:
	docker compose down --rmi local -v --remove-orphans

serverless-compose: start
	docker container stop area-area-server-1
	cd server && go run .
	cd ..
