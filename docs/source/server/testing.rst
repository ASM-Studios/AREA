.. Sphinx Documentation for Testing in Go with Testify

===========================
Go Testing with Testify
===========================

This documentation explains how to write tests using **Testify** in Go.

Installation
------------
To install Testify, use the following command:

.. code-block:: bash

    go get github.com/stretchr/testify

Structure
---------
The directory structure for organizing your tests:

.. code-block:: text

    project-root/
    ├── internal/
    │   ├── area/
    │   │   ├── service.go
    │   │   └── model.go
    ├── test/
    │   ├── area/
    │   │   ├── service_test.go
    │   │   ├── mock_service.go
    │   │   └── testdata/
    │   │       └── example.json
    │   ├── action_consumer/
    │   │   ├── consumer_test.go
    │   │   ├── mock_rabbitmq.go
    │   │   └── testdata/
    │   │       └── example.json
    ├── cmd/
    │   └── main.go
    ├── go.mod
    ├── go.sum

Example: Writing a Unit Test
-----------------------------
Here is an example of a unit test using Testify:

.. code-block:: go

    package area_test

    import (
        "testing"
        "AREA/internal/area"
        "github.com/stretchr/testify/assert"
    )

    func TestAdd(t *testing.T) {
        result := area.Add(2, 3)
        assert.Equal(t, 5, result, "they should be equal")
    }

Mocking with Testify
--------------------
To mock dependencies like RabbitMQ, use Testify's mock package:

.. code-block:: go

    package consumer

    import "github.com/stretchr/testify/mock"

    // MockRabbitMQ mocks RabbitMQ interactions
    type MockRabbitMQ struct {
        mock.Mock
    }

    func (m *MockRabbitMQ) Publish(message string) error {
        args := m.Called(message)
        return args.Error(0)
    }

Running Tests with Coverage
---------------------------
To measure test coverage, run:

.. code-block:: bash

    go test ./... -cover

To generate a detailed coverage report:

.. code-block:: bash

    go test ./... -coverprofile=coverage.out
    go tool cover -func=coverage.out


To generate an HTML report:

.. code-block:: bash

    go tool cover -html=coverage.out -o coverage.html

Automating Testing with Makefile
---------------------------------
You can use makefile command to run already implementing test commands:

- To run all tests and logs them without coverage:

.. code-block:: bash

    make test_server

- To run all tests and get result preview in a html file:

.. code-block:: bash

    make coverage_server

Best Practices
--------------
- Organize your tests in a `/test` directory mirroring your code structure.
- Use `testify/mock` to mock dependencies.
- Keep your tests focused on specific functionalities.
- Use `testdata` directories for static test resources.

