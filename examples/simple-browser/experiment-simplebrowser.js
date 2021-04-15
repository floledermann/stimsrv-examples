
const pause = require("stimsrv/task/pause");

module.exports = {
  
  name: "Example for including old browsers for stimulus display",
  
  devices: [
    {
      id: "dev"
    },
    {
      id: "oldbrowser",
      type: "browser-simple",
      refreshTime: 5,
      resolution: "hd",
      pixeldensity: 91,
      viewingdistance: 600,
    }
  ],
  
  roles: [
    {
      role: "display-oldbrowser",
      description: "Stimulus display on old browser",
      interfaces: ["display"],
      devices: ["dev","oldbrowser"]
    },
    {
      role: "response",
      description: "Response",
      interfaces: ["response"],
      devices: ["dev"]
    },
  ],
    
  tasks: [
  
    pause({
      message: "Hello from stimsrv",
    }),

    sloan({
      backgroundIntensity: 1,      // white background
      foregroundIntensity: 0,      // black foreground
      size:                        // size will be changed using the staircase method 
        staircase({                //   with 5 reversals, where each step will be 1.2 times
          startValue: "5mm",       //   larger / smaller than the previous one
          stepSize: 1.2,
          stepType: "multiply",
          minReversals: 2,
          minTrials: 2
      }),
    }), 
    
  ]
}