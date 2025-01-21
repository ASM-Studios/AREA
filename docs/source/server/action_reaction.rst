Action / Reaction Consumers
===========================

Consumers are programs designed to execute actions and reactions of a workflow.

.. mermaid::

    graph TD
        Front(Front)
        Main(Main program)

        ActionQueue(Action queue)
        ReactionQueue(Reaction queue)

        ActionConsumer1(Action consumer)
        ActionConsumer2(Action consumer)

        ReactionConsumer1(Reaction consumer)
        ReactionConsumer2(Reaction consumer)
        ReactionConsumer3(Reaction consumer)

        Front -- Create workflow --> Main

        Main -- Workflows --> ActionQueue

        ActionQueue -- Workflow --> ActionConsumer1
        ActionQueue -- Workflow --> ActionConsumer2

        ActionConsumer1 -- Workflow --> ReactionQueue
        ActionConsumer2 -- Workflow --> ReactionQueue

        ReactionQueue -- Workflow --> ReactionConsumer1
        ReactionQueue -- Workflow --> ReactionConsumer2
        ReactionQueue -- Workflow --> ReactionConsumer3


How To Launch Consumers?
------------------------

The action / reaction consumers are both implemented in server/cmd/action_consumer and server/cmd/reaction_consumer.

.. code-block:: bash

   go build -o action_consumer cmd/action_consumer/main.go      # For action consumer
   go build -o reaction_consumer cmd/reaction_consumer/main.go  # For reaction consumer
   ./action_consumer                                            # Launch action consumer
   ./reaction_consumer                                          # Launch reaction consumer

Action consumer
---------------

Action consumer is a consumer used to detect actions on the service. It is triggered by the main program (trigger queue).
It receives workflow directly from the main program.
A route has been defined to manually launch triggers. It is available at /trigger.
When an action is detected, the consumer will send a message to the reaction queue which will dispatch the workflow to a reaction consumer.

Reaction consumer
-----------------

Reaction consumer is a consumer used to process the action. It is triggered by the action consumer.
It receives the workflow and process all associated events on it.

Callbacks
---------

Both action and reaction consumers use callbacks to process fetch.
Callbacks are defined in a map. Callbacks' id **MUST** correlate to the one defined in the database.
