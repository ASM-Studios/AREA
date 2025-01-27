Installation
============

Follow these steps to set up and run the AREA Client Web project.

1. Clone the repository
-----------------------

.. code-block:: sh

    git clone git@github.com:ASM-Studios/AREA.git

2. Install GO packages
-----------------------

.. code-block:: sh

    cd AREA/server
    go mod tidy

This command will ensure all required dependencies are downloaded and your go.mod and go.sum files are up to date.

3. Set Up the Environment Variables
------------------
.. code-block:: sh

    cp .env.example .env

Update the .env file with the required environment variables.

4. Run the project
------------------

.. code-block:: sh

    go run

alternatively, you can run the project with the following command:

.. code-block:: sh

    go build -o area-server main.go
    ./area-server
