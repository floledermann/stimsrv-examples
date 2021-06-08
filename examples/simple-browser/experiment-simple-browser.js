
const pause = require("stimsrv/task/pause");
const sloan = require("stimsrv/task/sloan");
const text = require("./text.js");

const sequence = require("stimsrv/controller/sequence");

// IMPORTANT: this requires that you connect from a second device/browser
// using clientId "old" in order to get the "browser-simple" client

module.exports = {
  
  name: "Example for running stimulus display on old/simple browsers ",
  
  // Point to the server config which contains the client definitions.
  // This is a hack to keep the server code separate from the client's, and will
  // change with the next major release.
  serverConfigFile: "stimsrv-config.js",
  
  devices: [
    {
      id: "dev",
      resolution: "hd",
      imageSize: "600x600",
      pixeldensity: 91,
      viewingdistance: 600,
    },
    {
      id: "old",
      client: "browser-simple",
      resolution: "hd",
      imageSize: "600x600",
      pixeldensity: 91,
      viewingdistance: 600,
    },
    {
      id: "old2",
      client: "browser-canvas",
      resolution: "hd",
      imageSize: "600x600",
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

    text({
      parameters: {
        text: "ABCabc",
        //angle: 15,
        fontFamily: "Orelega One",
        fontSize: sequence(["10mm","15mm"])
      },
      fonts: [{
          family: "Orelega One",
          resource: "OrelegaOne-Regular.ttf"
      }]
    }), 
    
    pause({
      message: "Restart...",
    }),

    
  ]
}