
const pause = require("stimsrv/task/pause");
const sloan = require("stimsrv/task/sloan");
const text = require("./text.js");

const sequence = require("stimsrv/controller/sequence");

const puppeteerClient = require("stimsrv-client-puppeteer");

// IMPORTANT: this requires that you connect from a second device/browser
// using clientId "old" in order to get the "browser-simple" client

module.exports = {
  
  name: "Example for running stimulus display on old/simple browsers ",
  
  // register puppeteer client as an additional client
  clients: {
    "browser-simple": puppeteerClient()
  },
  
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
        fontFamily: "Roboto",
        fontSize: sequence(["10mm","15mm"])
      },
      fonts: [{
          family: "Roboto",
          resource: "Roboto-Regular.ttf"
      }]
    }), 
    
    pause({
      message: "Restart...",
    }),

    
  ]
}