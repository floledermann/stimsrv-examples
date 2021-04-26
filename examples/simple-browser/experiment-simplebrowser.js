
const pause = require("stimsrv/task/pause");
const sloan = require("stimsrv/task/sloan");

const staircase = require("stimsrv/controller/staircase");

// IMPORTANT: this requires that you connect from a second device/browser
// using clientId "old" in order to get the "browser-simple" client

module.exports = {
  
  name: "Example for running stimulus display on old/simple browsers ",
  
  devices: [
    {
      id: "anyone"
    },
    {
      id: "dev"
    },
    {
      id: "old",
      client: "browser-simple",
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
      devices: ["anyone","dev","oldbrowser"]
    },
    {
      role: "response",
      description: "Response",
      interfaces: ["response"],
      devices: ["anyone","dev"]
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