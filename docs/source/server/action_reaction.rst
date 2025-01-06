Action / Reaction Consumers
===========================

Consumers are programs designed to execute actions and reactions of a workflow.

.. mermaid::

   graph TD
       Front(Front)
       Main(Main program)
       ActionConsumer1(Action consumer:<br>Microsoft)
       ActionConsumer2(Action consumer:<br>Google)
       ReactionConsumer1(Reaction consumer:<br>Microsoft)  
       ReactionConsumer2(Reaction consumer:<br>Google)  
       Front -- Create workflow --> Main
       Main -- Trigger --> ActionConsumer1
       Main -- Trigger --> ActionConsumer2

       ActionConsumer1 -- MS associated reaction --> ReactionConsumer1
       ActionConsumer1 -- Google associated reaction --> ReactionConsumer2
       ActionConsumer2 -- ... --> ReactionConsumer1
       ActionConsumer2 -- ... --> ReactionConsumer2

How To Launch Consumers?
------------------------

The action / reaction consumers are both implemented in server/cmd/action_consumer and server/cmd/reaction_consumer.

A consumer is launched on a specific service using argv.

.. code-block:: bash

   go build -o action_consumer cmd/action_consumer/main.go      # For action consumer
   go build -o reaction_consumer cmd/reaction_consumer/main.go  # For reaction consumer
   ./action_consumer microsoft                                  # Launch action consumer for Microsoft
   ./reaction_consumer microsoft                                # Launch reaction consumer for Microsoft

Action consumer
---------------

Action consumer is a consumer used to detect actions on the service. It is triggered by the main program (trigger queue).
A route has been defined to manually launch triggers. It is available at /trigger.
When an action is detected, the consumer will send a message to the adequate reaction consumer (depending on the workflow event).

Reaction consumer
-----------------

Reaction consumer is a consumer used to process the action. It is triggered by the action consumer.
It receives the event and just process it.

Callbacks
---------

Both action and reaction consumers use callbacks to process fetch.
Callbacks are defined in a map. Callbacks' id **MUST** correlate to the one defined in the database.
