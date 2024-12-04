#! /bin/bash

# Stop the server
COMPOSE_FILE=build/docker-compose.yml
ENV_FILE=.env

if command -v docker-compose &> /dev/null
then
    docker-compose --env-file $ENV_FILE -f $COMPOSE_FILE down --remove-orphans
else
    docker compose --env-file $ENV_FILE -f $COMPOSE_FILE down --remove-orphans
fi
