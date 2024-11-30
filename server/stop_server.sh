#! /bin/bash

# Stop the server
COMPOSE_FILE=build/docker-compose.yml
ENV_FILE=.env

docker-compose --env-file $ENV_FILE -f $COMPOSE_FILE down --remove-orphans