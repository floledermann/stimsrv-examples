
const pause = require("stimsrv/task/pause");
const sloan = require("stimsrv/task/sloan");
const text = require("./text.js");

const sequence = require("stimsrv/controller/sequence");

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
      devices: ["anyone","dev","old"]
    },
    {
      role: "response",
      description: "Response",
      interfaces: ["response"],
      devices: ["anyone","dev"]
    },
  ],
    
  tasks: [
/*
    pause({
      message: "Hello from stimsrv",
    }),
*/
/*
    sloan({
      backgroundIntensity: 1,
      foregroundIntensity: 0,
      size: sequence(["5mm","3mm","2mm","1mm"])
    }), 
    */
    text({
      parameters: {
        fontFamily: "Orelega One",
        fontSize: sequence(["10mm"])
      },
      fonts: [
        {
          family: "Orelega One",
          resource: "font/OrelegaOne-Regular.ttf"
        }
      ]
    }), 
    
    pause({
      message: "Restart...",
    }),

    
  ]
}