Project Dependencies
==================

This page details all the technologies, tools, and external projects used in our DevOps setup.

Container Technologies
-------------------

Docker
~~~~~~
- **Version**: Latest
- **Usage**: Container orchestration and deployment
- **Purpose**: Ensures consistent development and production environments
- **Source**: `Official Docker <https://www.docker.com/>`_

Docker Compose
~~~~~~~~~~~~
- **Version**: 3.x
- **Usage**: Multi-container application definition and running
- **Purpose**: Orchestrates our microservices architecture
- **Source**: `Docker Compose <https://docs.docker.com/compose/>`_

Web Technologies
--------------

Nginx
~~~~~
- **Version**: Alpine-based
- **Usage**: Web server and reverse proxy
- **Purpose**: Serves web client and handles APK downloads
- **Image**: nginx:alpine
- **Source**: `Official Nginx <https://hub.docker.com/_/nginx>`_

Development Technologies
---------------------

Flutter
~~~~~~
- **Version**: Stable
- **Usage**: Mobile client development
- **Purpose**: Cross-platform mobile application development
- **Image**: ghcr.io/cirruslabs/flutter:stable
- **Source**: `CirrusLabs Flutter <https://github.com/cirruslabs/docker-images-flutter>`_

Node.js
~~~~~~~
- **Version**: Latest LTS
- **Usage**: Web client development
- **Purpose**: React application building and serving
- **Image**: node:latest
- **Source**: `Official Node.js <https://hub.docker.com/_/node>`_

Development Tools
---------------

mkcert
~~~~~~
- **Purpose**: Local SSL certificate generation
- **Usage**: Development SSL certificates
- **Source**: `FiloSottile/mkcert <https://github.com/FiloSottile/mkcert>`_

Sphinx
~~~~~~
- **Purpose**: Documentation generation
- **Version**: Latest
- **Usage**: Project documentation
- **Source**: `Sphinx Documentation <https://www.sphinx-doc.org/>`_

Package Managers
--------------

npm
~~~
- **Purpose**: Node.js package management
- **Used By**: Web client
- **Source**: `npm <https://www.npmjs.com/>`_

pub
~~~
- **Purpose**: Flutter/Dart package management
- **Used By**: Mobile client
- **Source**: `pub.dev <https://pub.dev/>`_

Version Control
-------------

Git
~~~
- **Usage**: Source code management
- **Purpose**: Version control and collaboration
- **Source**: `Git <https://git-scm.com/>`_ 