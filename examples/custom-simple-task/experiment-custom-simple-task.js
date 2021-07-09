
const sequence = require("stimsrv/controller/sequence");
const random = require("stimsrv/controller/random");

const pause = require("stimsrv/task/pause");

const customTextTask = require("./customSimpleTask.js");

// Example showing how to implement & use a custom task using the simpleTask helper.
// Inspect customSimpleTask.js in this directory to see how the task is defined.
// This file uses the "customTextTask" task defined in customSimpleTask.js.

// The simpleTask helper provides a few helpful features for implementing tasks.

// Global reconfiguration of defaults
customTextTask.defaults({
  backgroundIntensity: 0.8,   // use light grey background by default
  fontFamily: "Orelega One",  // use custom font
  fonts: [{                   // specify font resource to load
    family: "Orelega One",
    resource: "resources/OrelegaOne-Regular.ttf"
  }]
});

module.exports = {
  
  name: "Custom Task using simpleTask Helper Example",
  
  roles: [
    {
      role: "participant",
      devices: ["anyone"],
      interfaces: ["display", "response", "displayTask1"] // define a custom interface "displayTask1"
    }
  ],
    
  tasks: [
  
    // Inspect customSimpleTask.js to see how this task is implemented
    
    // Basic usage: Only argument is a configuration object with iterators for changing condition parameters
    // for most applications, this way of setting up the task will be sufficient
    customTextTask({
      name: "task1",
      description: "This is the first test task.",
      
      text: "Task 1",
      fontSize: sequence(["5mm","4mm","3mm"]),  // Assignment of condition properties from generators. 
                                                // (Unit conversion is handled by canvasRenderer)
      rotate: random.range(-60,60, {round: 1}), // "rotate" and "translate" parameters are handled by canvasRenderer
      translate: ["3cm","-3cm"],                // Unit conversion is handled by canvasRenderer
      choices: ["A","B"],                       // see the customSimpleTask.js source for how the choices property is passed to the buttons
      
      // Redefinition of interfaces to use for this task
      // display the stimulus for this task on a specific interface
      // this requires custom css for specifying the size of the interface
      //displayInterface: "displayTask1",
      
      // add some custom css when this task is activated
      css: `                                    
        .buttons button {
          text-transform: uppercase;
        }
      `,
    }),
    
    // Complex usage, using multiple property specifications.
    // This can be used to generate more complex conditions,
    // e.g. multiple fields that depend on one another or choosing from a set of conditions
    customTextTask(
      // First argument is an *array* of parameter specifications to construct the condition in multiple steps
      // Each step may be an object, a generator or a transformation function
      [
        // Step 1: define properties like above
        {
          name: "task2",
          description: "This is the second test task.",
          rotate: random.range(-60,60, {round: 1}),
          choices: ["A","B"],
        },
        // Step 2: Generator for conditions composed of multiple dependent properties
        random.shuffle([
          {
            text: "Large Text",
            fontSize: "10mm",
          },
          {
            text: "Small Text",
            fontSize: "3mm",
          }
        ], {multiple: 3}),
        // Step 3: Transformation function (invoked on server)
        context => condition => ({ text: condition.text + " (Task2, dynamic!)" }),
      ],
      // Second argument is a transformation function that transforms the condition *on each client*
      context => condition => ({ text: condition.text + ", viewed on device id: " + context.deviceid })
    ),
    
      
    pause({
      message: "Experiment ended. Press 'Continue' to restart."
    })
    
  ]
}