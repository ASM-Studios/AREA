Deployment Documentation
======================

This documentation outlines the steps for deploying and managing the project using the provided shell scripts. The deployment utilizes Docker Compose to run RabbitMQ, MariaDB, and the server application.

Prerequisites
=============

Before deploying the project, ensure the following are installed on your system:

- `Docker`
- `Docker Compose`
- `.env` file with the required environment variables (such as `DB_USER`, `DB_PASSWORD`, `DB_NAME`, etc.)

Deployment Scripts
==================

Start the Server
----------------

To deploy and start all containers (RabbitMQ, MariaDB, and the server), use the `./start_server.sh` script.

This script does the following:

1. Loads the `.env` file.
2. Starts the Docker Compose setup defined in `build/docker-compose.yml`.

**Command:**

.. code-block:: bash

    ./start_server.sh

**What Happens:**

- The RabbitMQ container starts on the configured ports.
- The MariaDB container starts with the credentials and database specified in `.env`.
- The server application is built (if necessary) and started.

Stop the Server
---------------

To stop and remove all running containers, use the `./stop_server.sh` script.

This script does the following:

1. Stops all services defined in the Docker Compose file.
2. Optionally cleans up unused containers.

**Command:**

.. code-block:: bash

    ./stop_server.sh

**What Happens:**

- RabbitMQ, MariaDB, and the server containers are stopped.
- Docker networks and volumes are preserved unless explicitly removed.

Rebuilding the Server
---------------------

If you need to rebuild the server application, you can do so by cleaning up and restarting the Docker Compose setup.

1. Run the following command to remove existing containers and their build cache:

.. code-block:: bash

    docker-compose -f build/docker-compose.yml down --rmi all --volumes

2. Restart the server:

.. code-block:: bash

    ./start_server.sh

Environment Variables
=====================

The `.env` file is essential for the deployment. It should define all required environment variables, such as:

.. code-block:: text

    DB_HOST=
    DB_PORT=
    DB_NAME=
    DB_USER=
    DB_PASSWORD=
    SECRET_KEY=

Ensure the `.env` file is placed in the root directory of the project.

Docker Compose Services
=======================

The `build/docker-compose.yml` file defines the following services:

1. **RabbitMQ**: Message broker for managing asynchronous communication.
   - Management console exposed on `http://localhost:15672`.
   - Default ports: `15672` (management) and `5672` (message broker).

2. **MariaDB**: Database service for persistent storage.
   - Default port: `3306`.
   - Credentials and database name configured in `.env`.

3. **Server**: The Go-based backend application.
   - Default port: `8080`.

Troubleshooting
===============

- **Port Conflicts:** Ensure that the ports specified in the `build/docker-compose.yml` file are not already in use.
  Use the following command to list all running containers and their ports:

  .. code-block:: bash

      docker ps
