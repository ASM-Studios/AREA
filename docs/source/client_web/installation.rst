Installation
============

Docker
======

This project is shipped inside a docker that let you run all parts of the project

1. Run the docker
-----------------

.. code-block:: sh

    make build && make start


Standalone
==========

If you only wish for the web client to run, follow these steps to set up and run the AREA Client Web project.

1. Clone the repository
-----------------------

.. code-block:: sh

    git clone git@github.com:ASM-Studios/AREA.git

2. Install NPM packages
-----------------------

.. code-block:: sh

    cd AREA/client_web
    npm install

3. Run the project
------------------

To start the front-end, ensure that the following binaries are available:

mkcert - For generating SSL certificates.

.. code-block:: sh

    npm run start
