
const sequence = require("stimsrv/controller/sequence");
const random = require("stimsrv/controller/random");
const staircase = require("stimsrv/controller/staircase");

const pause = require("stimsrv/task/pause");
const text = require("stimsrv/task/text");

const htmlButtons = require("stimsrv/ui/htmlButtons");

module.exports = {
  
  name: "Basic Examples",
  
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
  
    // A basic text task 
    text({
      name: "task1",                // Name of the task (will be used in results data) 
      text: "Can you read this?",   // Text to display
                                    // Using a single-shot iterator to end the task after one trial.
      fontSize: sequence(["4mm"]),  // Font size. Dimensions will be converted to pixels internally.
      rotate: 10,                   // Rotate by 10 degrees
      choices: ["Yes","No"]
    }),
    
    // Implementing a custom generator for task properties
    text({
      name: "task1",                
      text: context => {
        let count = 0;
        return {
          next: function(lastCondition, lastResponse, trials) {
            count++;
            if (lastResponse && lastResponse.choice == "No") return {done: true};
            return { value: "Trial " + count + ". Continue?" };
          }
        }
      },
      choices: ["Yes","No"]
    }),
    
    // Using a staircase method to adjust the font size
    text({
      name: "task1",                
      text: "Can you read this?",
      fontSize: staircase({
        startValue: "4mm",
        numDown: 1,
        isResponseCorrect: context => (condition, response) => response.choice == "Yes"
      }),
      choices: ["Yes","No"]
    }),
      
    pause({
      message: "Experiment ended. Press 'Continue' to restart."
    })
    
  ]
}