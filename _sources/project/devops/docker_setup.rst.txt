Docker Setup
===========

Our project uses Docker and Docker Compose for containerization and orchestration. The setup consists of multiple services working together to provide a complete application stack.

Service Architecture
------------------

Core Services
~~~~~~~~~~~~

**Database (MariaDB)**
    - Image: ``mariadb:11.4.4``
    - Port: 3306
    - Persistent volume for data storage
    - Initialized with custom SQL script

**Message Queue (RabbitMQ)**
    - Image: ``rabbitmq:4.0.4-management-alpine``
    - Ports: 5672 (AMQP), 15672 (Management UI)
    - Custom configuration via rabbitmq.conf
    - Health monitoring enabled

**Server**
    - Custom Golang-based API server
    - Port: 8080
    - Dependencies: MariaDB, RabbitMQ
    - Health endpoint monitoring
    - SSL certificate volume mount

Consumer Services
~~~~~~~~~~~~~~~

**Action Consumer**
    - Processes action events from RabbitMQ
    - Depends on server and message queue
    - Shares environment with main server

**Reaction Consumer**
    - Handles reaction events from RabbitMQ
    - Depends on server and message queue
    - Shares environment with main server

Client Services
~~~~~~~~~~~~~

**Web Client**
    - React-based frontend
    - Port: ${VITE_PORT} (default: 8081)
    - Nginx-based serving
    - Access to mobile builds for APK distribution
    - Health monitoring enabled

**Mobile Client**
    - Flutter-based mobile application
    - Builds Android APK
    - Shares build output with web client
    - No persistent runtime container

Volume Management
---------------

Persistent Volumes
~~~~~~~~~~~~~~~~

- **mariadb_data**: Database persistence
- **mobile_builds**: APK distribution between containers
- **ssl**: SSL certificates (read-only)

Environment Configuration
----------------------

Each service uses dedicated .env files:

- **.env**: Root environment variables
- **server/.env**: Server-specific configuration
- **client_web/.env**: Web client configuration
- **client_mobile/.env**: Mobile client configuration

Deployment Profiles
-----------------

The setup supports different deployment profiles:

**server**
    - MariaDB
    - RabbitMQ
    - Server + Consumers
    - Healthcheck container

**web**
    - Server profile services
    - Web client
    - Healthcheck container

**mobile**
    - Server profile services
    - Mobile client builder
    - Healthcheck container

**full**
    - All services
    - Complete healthcheck

Network Configuration
------------------

All services communicate through the ``area_network`` bridge network, providing isolated container communication.

Health Monitoring
--------------

Each major service includes health checks:

- **MariaDB**: Database connection check
- **RabbitMQ**: Management API check
- **Server**: HTTP endpoint check
- **Web Client**: HTTPS endpoint check

Usage
-----

Basic Commands:

.. code-block:: bash

    # Start all services
    make start

    # Start specific profile
    make start-web
    make start-mobile
    make start-server

    # Build services
    make build

    # Stop all services
    make stop

    # View logs
    make logs

Access Points
-----------

- Web Client: ``https://localhost:8081``
- API Server: ``http://localhost:8080``
- RabbitMQ UI: ``http://localhost:15672``
- Mobile APK: ``https://localhost:8081/mobile_builds/client.apk`` 