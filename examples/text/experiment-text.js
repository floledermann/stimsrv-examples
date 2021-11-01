
const sequence = require("stimsrv/controller/sequence");
const random = require("stimsrv/controller/random");
const staircase = require("stimsrv/controller/staircase");

const pause = require("stimsrv/task/pause");
const text = require("stimsrv/task/text");

const htmlButtons = require("stimsrv/ui/htmlButtons");

// Example showing how to implement & use a custom task using the simpleTask helper.
// Inspect customSimpleTask.js in this directory to see how the task is defined.
// This file uses the "customTextTask" task defined in customSimpleTask.js.

// The simpleTask helper provides a few helpful features for implementing tasks.

// Global configuration of defaults
text.defaults({
  backgroundIntensity: 0.8,   // use light grey background by default
  fontFamily: "Orelega One",  // use custom font
  fonts: [{                   // specify font resource to load
    family: "Orelega One",
    resource: "resources/OrelegaOne-Regular.ttf"
  }]
});

module.exports = {
  
  name: "Text Task Example",
  
  devices: [
    {
      id: "anyone",
      pixelDensity: 100
    }
  ],
  
  roles: [
    {
      role: "participant",
      devices: ["anyone"],
      interfaces: ["display", "response"]
    }
  ],
    
  tasks: [

    // Basic usage: Only argument is a configuration object with iterators for changing condition parameters
    // for most applications, this way of setting up the task will be sufficient
    text({
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

    text({
      // Define properties like above
      name: "task2",
      description: "This is the second test task.",
      rotate: random.range(-60,60, {round: 1}),
      translate: ["3cm","-3cm"],
      choices: ["a","b"],
      
      // Use generateCondition() to modify the condition created from above template
      // This can be used to apply sets of parameters belonging together through an iterator
      // or writing your own code to create conditions
      generateCondition: random.shuffle([
        {
          text: "Task 2: Large Text",
          fontSize: "10mm",
        },
        {
          text: "Task 2: Small Text",
          fontSize: "3mm",
        }
      ]),
      
      // Use transformConditionOnClient() to transform the condition *on each client*
      transformConditionOnClient: clientContext => condition => ({ text: condition.text + ", device id: " + clientContext.clientid })
    }),
    

    text({
      // Define properties like above
      name: "task3",
      description: "This is the second test task.",
      rotate: random.range(-60,60, {round: 1}),
      translate: sequence.array([random.range(-3,3, {suffix: "cm"}),random.range(-3,3, {suffix: "cm"})]),
      choices: ["a","b"],
      
      // Use generateCondition() to modify the condition created from above template
      // This can be used to apply sets of parameters belonging together through an iterator
      // or writing your own code to create conditions
      generateCondition: context => {
        // initialize the generator
        let set = random.shuffle([
          {
            text: "Large Text",
            fontSize: "10mm",
          },
          {
            text: "Small Text",
            fontSize: "3mm",
          }
        ], {multiple: 3})(context); // repeat each item 3 times
        
        return cond => {
          // care needs to be taken to handle generator exhaustion -> return null to end the task
          let next = set.next();
          if (next.done) return null;
          // clone object from generator to avoid modifying the original object!
          cond = Object.assign({}, next.value);
          cond.text = "Task 3, dynamic: " + cond.text;
          return cond;
        }
      },
      
      // Use transformConditionOnClient() to transform the condition *on each client*
      transformConditionOnClient: clientContext => condition => ({ text: condition.text + ", device id: " + clientContext.clientid }),
      
      // override response interface with customized ui
      interfaces: {
        response: context => htmlButtons({
          buttons: condition => condition.choices.reverse().map(
            choice => ({
              label: choice,
              response: {text: choice} 
            })
          )
        })
      },
    }),
    
      
    pause({
      message: "Experiment ended. Press 'Continue' to restart."
    })
    
  ]
}