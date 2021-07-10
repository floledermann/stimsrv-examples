
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
      interfaces: ["display", "response"]
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
      choices: ["a","b"],                       // see the customSimpleTask.js source for how the choices property is passed to the buttons
      
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
        // Step 1: Define properties like above
        {
          name: "task2",
          description: "This is the second test task.",
          rotate: random.range(-60,60, {round: 1}),
          translate: sequence.array([random.range(-3,3, {suffix: "cm"}),random.range(-3,3, {suffix: "cm"})]),
          choices: ["a","b"],
        },
        // Step 2: Use a generator for conditions composed of multiple dependent properties
        random.shuffle([
          {
            text: "Large Text",
            fontSize: "10mm",
          },
          {
            text: "Small Text",
            fontSize: "3mm",
          }
        ], {multiple: 3}), // repeat each item 3 times
        // Step 3: Transformation function (invoked on server to transform the condition)
        context => condition => ({ text: condition.text + " (Task2, dynamic!)" }),
      ],
      // Second argument is a transformation function that transforms the condition *on each client*
      context => condition => ({ text: condition.text + ", device id: " + context.clientid })
    ),
    
      
    pause({
      message: "Experiment ended. Press 'Continue' to restart."
    })
    
  ]
}