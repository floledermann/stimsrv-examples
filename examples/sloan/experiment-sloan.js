
const pause = require("stimsrv/task/pause");
const sloan = require("stimsrv/task/sloan");

const staircase = require("stimsrv/controller/staircase");

module.exports = {
  
  name: "A small experiment to test visual acuity",
    
  tasks: [
  /*
    pause({
      message: "Press 'Continue' when you are ready to start the experiment"
    }),
    */
    sloan({
      backgroundIntensity: 1,      // white background
      foregroundIntensity: 0,      // black foreground
      size:                        // size will be changed using the staircase method 
        staircase({                //   with 5 reversals, where each step will be 1.2 times
          startValue: "5mm",       //   larger / smaller than the previous one
          stepSize: 1.2,
          stepType: "multiply",
          minReversals: 0,
          minTrials: 2
      }),
      // add the resulting logMAR score to the context
      nextContext: trials => ({logMAR: sloan.logMAR(trials)})
    }),
    
    pause({
      message: context => "Your visual acuity was determined at logMAR " + context.logMAR + "."
    }),
    
  ]
}