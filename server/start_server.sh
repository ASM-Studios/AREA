#! /bin/bash

# Start the server
COMPOSE_FILE=build/docker-compose.yml
ENV_FILE=.env

docker-compose --env-file $ENV_FILE -f $COMPOSE_FILE -p server up --build -d