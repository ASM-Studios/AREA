Production Docker Setup
=====================

This document describes the production-ready Docker configuration for the AREA project. The setup provides a secure, scalable, and maintainable deployment environment for all services.

Service Architecture
------------------

Core Services
~~~~~~~~~~~~

**MariaDB Database**
    - Image: ``mariadb:11.4.4``
    - Port: 3306
    - Persistent volume for data storage
    - Initialized with custom SQL script
    - Health monitoring enabled
    - Environment-based configuration

**Message Queue (RabbitMQ)**
    - Image: ``rabbitmq:4.0.4-management-alpine``
    - Ports: 
        - 5672 (AMQP protocol)
        - 15672 (Management UI)
    - Custom configuration via ``rabbitmq.conf``
    - Health monitoring enabled
    - Management interface for monitoring

Backend Services
~~~~~~~~~~~~~~

**Main Server**
    - Custom Golang-based API server
    - Port: 8080
    - SSL certificate support
    - Health endpoint monitoring
    - Dependencies: MariaDB, RabbitMQ
    - Environment-based configuration

**Action Consumer**
    - Dedicated action processing service
    - Built from main server codebase
    - Automatic restart on failure
    - Depends on:
        - Main server
        - MariaDB
        - RabbitMQ

**Reaction Consumer**
    - Dedicated reaction processing service
    - Built from main server codebase
    - Automatic restart on failure
    - Shares dependencies with Action Consumer

Frontend Services
~~~~~~~~~~~~~~

**Web Client**
    - Node.js-based frontend
    - Nginx server with SSL
    - Port: 8081 (HTTPS)
    - Features:
        - Automatic SSL certificate generation
        - Static file optimization
        - Gzip compression
        - Security headers
        - Cache control

**Mobile Client**
    - Flutter-based mobile application
    - One-time APK build process
    - Shared volume for APK distribution
    - Health monitoring for build completion

Infrastructure Components
----------------------

Volume Management
~~~~~~~~~~~~~~

**Persistent Volumes**
    - ``mariadb_data``: Database storage
    - ``mobile_builds``: APK distribution
    - ``ssl``: Certificate storage

Network Configuration
~~~~~~~~~~~~~~~~~

**area_network**
    - Bridge network driver
    - Internal service discovery
    - Isolated container communication
    - Secure service-to-service communication

Security Features
~~~~~~~~~~~~~~

- SSL/TLS encryption for web traffic
- Environment variable isolation
- Network segmentation
- Nginx security headers
- Regular security updates
- Health monitoring
- Automatic container recovery

Deployment Management
------------------

Prerequisites
~~~~~~~~~~~

- Docker Engine 20.10+
- Docker Compose V2
- SSL certificates
- Configured environment variables

Basic Operations
~~~~~~~~~~~~~

.. code-block:: bash

    # Build production images
    make prod-build

    # Start production environment
    make prod-up

    # View logs
    make prod-logs

    # Stop services
    make prod-down

    # Clean up
    make prod-clean

    # Restart specific service
    make prod-restart-service service=<service_name>

Monitoring & Maintenance
---------------------

Health Monitoring
~~~~~~~~~~~~~~

- Service-specific health checks
- RabbitMQ management interface
- Docker container logs
- Compose service status

Maintenance Tasks
~~~~~~~~~~~~~~

- Regular image updates
- Database backups
- Log rotation
- Automatic restarts
- Environment variable management

Troubleshooting Guide
------------------

1. Service Health Check
   
   .. code-block:: bash

       docker compose -f docker-compose.prod.yml ps

2. Log Investigation
   
   .. code-block:: bash

       make prod-logs

3. Service Restart
   
   .. code-block:: bash

       make prod-restart-service service=<service_name>

4. Full System Reset
   
   .. code-block:: bash

       make prod-clean && make prod-build 