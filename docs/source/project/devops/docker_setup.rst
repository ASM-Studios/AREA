Docker Setup
===========

Our project uses Docker and Docker Compose for containerization and orchestration.
The following examples could vary depending on the project's environment variables (ports and endpoints).
Here's an overview of our Docker setup:

Container Structure
-----------------

The project consists of several Docker containers:

- **area-client-web**: React-based web client (Port 8081)
- **area-client-mobile**: Flutter-based mobile client
- **shared volumes**: For APK distribution

Docker Compose Configuration
--------------------------

Our ``docker-compose.yml`` defines the following services:

Client Web
~~~~~~~~~
.. code-block:: yaml

    area-client-web:
      build: ./client_web
      ports:
        - "8081:8081"
      volumes:
        - area-client-data:/usr/share/nginx/html/mobile_builds

Client Mobile
~~~~~~~~~~~~
.. code-block:: yaml

    area-client-mobile:
      build: ./client_mobile
      volumes:
        - area-client-data:/app/build/app/outputs/flutter-apk

Volume Management
---------------

We use a shared volume ``area-client-data`` to handle APK distribution between containers:

.. code-block:: yaml

    volumes:
      area-client-data:

This allows the mobile client's APK to be accessible from the web client for downloads.

Building and Running
------------------

To build and run the project:

.. code-block:: bash

    make start

Access Points
-----------

Locally:

- Web Client: ``http://localhost:8081``
- Mobile APK Download: ``http://localhost:8081/client.apk`` 