#! /bin/bash

# Start the server
COMPOSE_FILE=build/docker-compose.yml
ENV_FILE=.env

if command -v docker-compose &> /dev/null
then
    docker-compose --env-file $ENV_FILE -f $COMPOSE_FILE -p server up --build -d
else
    docker compose --env-file $ENV_FILE -f $COMPOSE_FILE -p server up --build -d
fi
