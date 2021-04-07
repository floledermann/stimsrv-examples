
const pause = require("stimsrv/src/tasks/pause.js");
const loop = require("stimsrv/src/tasks/loop.js");   

const sequence = require("stimsrv/src/controller/sequence.js");
const count = require("stimsrv/src/controller/count.js");

const desktop = require("../../config-desktop.js");

module.exports = {
  
  name: "Loop Example",
  
  devices: desktop.devices,
  roles: desktop.roles,
  storage: desktop.storage,
  
  context: {
    // the context property "message" will alternate between these two values with each participant
    message: sequence.loop(["Odd number participant", "Even number participant"])
  },
  
  tasks: [
    // first task
    pause({
      // compose message from context information
      message: {
        display: context => "Task 1\n" + context.message + "\n" + (context.message2 || "")
      }
    }),
    
    // second task - loop
    loop({
      context: {
        // auto-incrementing loop counter (starts at 1)
        loopCounter: count()
      },
      loop: context => {
        // this is executed at the end of the loop, before updating the context
        // return true if the loop shoud be continued
        // so this loop will stop after the 2nd pass
        return context.loopCounter < 2;
      },
      // loop those tasks
      tasks: [
        pause({
          // this is the only task that gets stored (by default, store == false for the pause task)
          store: true,
          message: {
            display: context => "Task 2.1\nCounter: " + context.loopCounter + "\n" + context.message + "\n" + (context.message2 || "")
          }
        }),
        pause({
          message: {
            display: context => "Task 2.2\nCounter: " + context.loopCounter + "\n" + context.message + "\n" + (context.message2 || "")
          }
        }),
        // inner loop
        loop({
           context: {
            // context parameters of sub-loops override the outer context, but only during the inner loop
            // the "loopCounter" parameter will start at 5 for the inner loop, and then return to its
            // original value for the outer loop
            loopCounter: 5,
            // also the message will change only for the duration of this inner loop
            message: "Local message for Task 2.3",
            // context parameters of the inner loop that didn't exist in the outer context 
            // will be copied to the outer context by default
            // so this parameter will stay active for the outer loop 
            // (set modifyContext: false for the loop to disable this behaviour)
            message2: "Participant has seen Task 2.3!"
          },
          loop: context => {
            // manual loop counter - simply increment in the loop callback
            context.loopCounter++;
            return context.loopCounter < 7;
          },
          tasks: [
            pause({
              message: {
                display: context => "Task 2.3.1\nCounter: " + context.loopCounter + "\n" + context.message + "\n" + context.message2
              }
            }),
            pause({
              message: {
                display: context => "Task 2.3.2\nCounter: " + context.loopCounter + "\n" + context.message + "\n" + context.message2
              }
            })
          ],
        }),
      ],
    }),
    pause({
      message: {
        display: "Thank you for your participation!",
      },
      button: "Restart",
    }),
  ]
}