RabbitMQ: Example Consumer
==========================

What is a Consumer?
--------------------

A consumer is a service or component that listens to a RabbitMQ queue for incoming messages. Consumers are used to handle tasks asynchronously and process data as it becomes available.

How Does It Work?
------------------

1. **Connection**: The consumer connects to the RabbitMQ server using credentials and the queue name.
2. **Listening**: It listens to the specified queue for messages.
3. **Processing**: Upon receiving a message, it processes the data (e.g., storing it in a database or performing calculations).
4. **Acknowledgment**: Once the processing is done, the message is acknowledged to RabbitMQ.

How to Create a Consumer?
--------------------------

1. Import the RabbitMQ connection library.
2. Define the queue name and configure the connection.
3. Implement a callback function to handle incoming messages.
4. Start the consumer to listen for messages.

.. code-block:: go

    package main

    import (
        "log"
        "github.com/streadway/amqp"
    )

    func main() {
        conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
        if err != nil {
            log.Fatalf("Failed to connect to RabbitMQ: %s", err)
        }
        defer conn.Close()

        ch, err := conn.Channel()
        if err != nil {
            log.Fatalf("Failed to open a channel: %s", err)
        }
        defer ch.Close()

        q, err := ch.QueueDeclare(
            "example_queue",
            false,
            false,
            false,
            false,
            nil,
        )
        if err != nil {
            log.Fatalf("Failed to declare a queue: %s", err)
        }

        msgs, err := ch.Consume(
            q.Name,
            "",
            true,
            false,
            false,
            false,
            nil,
        )
        if err != nil {
            log.Fatalf("Failed to register a consumer: %s", err)
        }

        forever := make(chan bool)

        go func() {
            for d := range msgs {
                log.Printf("Received a message: %s", d.Body)
                // Process the message here
            }
        }()

        log.Printf(" [*] Waiting for messages. To exit press CTRL+C")
        <-forever
    }