
const sequence = require("stimsrv/controller/sequence");
const random = require("stimsrv/controller/random");

const pause = require("stimsrv/task/pause");

// Inspect customSimpleTask.js to see how the task is implemented
const customTextTask = require("./customSimpleTask.js");

// The simpleTask helper provides a few helpful features for implementing tasks.
// These are enumerated with (#n) in this file

// (#1) configuration of defaults
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
    customTextTask({
      text: "Task 1",
      fontSize: sequence(["5mm","4mm","3mm"]),  // (#2) assignment of condition properties from generators. 
                                                // (Unit conversion is handled by canvasRenderer)
      rotate: random.range(-60,60, {round: 1}), // "rotate" and "translate" parameters are handled by canvasRenderer
      translate: ["3cm","-3cm"],                // Unit conversion is handled by canvasRenderer
      choices: ["A","B"],                       // see the customSimpleTask.js source for how the choices property is expanded into buttons
    }),
    
    // Complex usage, using a multiple property specifications: 
    customTextTask(
      //  First argument is an array of parameter specifications, including transformation functions
      [
        // Define our condition generator like above
        {
          text: sequence(["Task 2.1","Task 2.2","Task 2.3"]),
          fontSize: sequence(["5mm","4mm","3mm"]),
          rotate: random.range(-60,60, {round: 1}),
          choices: ["A","B"],
        },
        // Transform the generated condition with a function (on the server)
        context => condition => ({ text: condition.text + " (dynamic!)" }),
      ],
      // Second argument is a transformation function that transforms the condition *on each client*
      context => condition => ({ text: condition.text + ", viewed on device id: " + context.deviceid })
    ),
    
      
    pause({
      message: "Experiment ended. Press 'Continue' to restart."
    })
    
  ]
}