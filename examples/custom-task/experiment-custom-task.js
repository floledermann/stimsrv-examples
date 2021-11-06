
const pause = require("stimsrv/task/pause");

module.exports = {
  
  name: "Custom Tasks Example",
  
  roles: [
    {
      role: "participant",
      devices: ["anyone"],
      // The interfaces this role will display. Each interface will be represented by a <section> in the UI.
      // You can name those freely, but by convention 
      // "display" is used for stimulus display 
      // and "response" is used for participant response
      interfaces: ["display", "response"]
    }
  ],
    
  tasks: [
  
    // ------------------------------------ TASK 1 ------------------------------------
    // Let's make a custom task from scratch, without any help from library functions!
    // A stimsrv task is simply a plain JS object adhering to a simple structure.
    // On the top level, there are 3 entries: name, ui, controller
    {
      // *name* is simply the name/id of the task (will be used in saved data, for example)
      name: "task1",
      // *ui* is a function that receives the task's context and 
      // returns information on the task's ui components.
      // The task's ui will be rendered on each participating client.
      frontend: context => {
        let textEl = null;
        let buttonEl = null;
        // The object returned by task.ui() has to have an "interfaces" entry
        return {
          interfaces: {
            // The entries in the interfaces object are matched up with the interfaces 
            // defined by the client role (defined above at the experiment level).
            // By convention, the "display" interface is used for displaying the stimulus:
            "display": {
              // Each inerfaces entry contains two functions: initialize() and render().
              // initialize() gets passed the parent element and the stimsrv client API,
              // and sets up ui elements and interaction.
              initialize: (parent, stimsrv) => {
                // Add a simple text element to the parent
                textEl = parent.ownerDocument.createElement("p");
                textEl.innerHTML = "Hello, stimsrv!";
                parent.appendChild(textEl);
              },
              // render() adapts the ui to the current condition (as received from the server)
              render: condition => {
                textEl.innerHTML += "<br>" + condition.text;
              }
            },
            // Second ui component.
            // By convention, the "response" interface is used for entering user responses:
            "response": {
              initialize: (parent, stimsrv) => {
                // Add a button
                buttonEl = parent.ownerDocument.createElement("button");
                buttonEl.textContent = "Next";
                parent.appendChild(buttonEl);
                // Set up the button so clicking it sends a response to the server
                buttonEl.addEventListener("click", () => {
                  stimsrv.response({
                    // Response data - can be anything you want to send to the controller
                  });
                });
              },
              render: condition => {
                // The response ui can also adapt dynamically to the condition
                if (condition.count == 3) {
                  buttonEl.textContent = "Finish";
                }
              }
            }
          }
        }
      },
      // The "controller" part is run on the server and coordinates the flow of the experiment.
      // *controller* is also a function that receives the current context and returns an object.
      controller: context => ({
        // nextCondition() is the only mandatory entry in the controller object.
        // It receives data from the previous conditions and responses,
        // and returns the next condition, or null if the task has finished.
        nextCondition: (lastCondition, lastResponse, conditions, responses) => {
          if (conditions.length < 3) {
            return {
              // Condition data - can be anything you want to send to the client(s)
              text: "Condition " + (conditions.length + 1),
              count: conditions.length + 1
            };
          }
          // Return null when end of task has been reached
          return null;
        }
      })
    },
    // ---------------------------------- END TASK 1 ----------------------------------
    
    
    
    // ------------------------------------ TASK 2 ------------------------------------
    // The same task, without comments to see the structure more clearly
    {
      name: "task2",
      frontend: context => {
        let textEl = null;
        let buttonEl = null;
        return {
          interfaces: {
            "display": {
              initialize: (parent, stimsrv) => {
                textEl = parent.ownerDocument.createElement("p");
                textEl.innerHTML = "Hello, stimsrv! Task 2";
                parent.appendChild(textEl);
              },
              render: condition => {
                textEl.innerHTML += "<br>" + condition.text;
              }
            },
            "response": {
              initialize: (parent, stimsrv) => {
                buttonEl = parent.ownerDocument.createElement("button");
                buttonEl.textContent = "Next";
                parent.appendChild(buttonEl);
                buttonEl.addEventListener("click", () => {
                  stimsrv.response({}); // send empty response object
                });
              },
              render: condition => {
                if (condition.count == 3) {
                  buttonEl.textContent = "Finish";
                }
              }
            }
          }
        }
      },
      controller: context => ({
        nextCondition: (lastCondition, lastResponse, conditions, responses) => {
          if (conditions.length < 3) {
            return {
              text: "Condition " + (conditions.length + 1),
              count: conditions.length + 1
            };
          }
          return null;
        }
      })
    },
    // ---------------------------------- END TASK 2 ----------------------------------
    
    
    
    // ------------------------------------ TASK 3 ------------------------------------
    // Inspect the pause task at 
    // https://github.com/floledermann/stimsrv/blob/main/src/task/pause.js
    // to see how a reusable task can be implemented using above principles
    // and some helper functions 
    pause({
      message: "Experiment ended. Press 'Continue' to restart."
    })
    // ---------------------------------- END TASK 3 ----------------------------------
    
  ]
}