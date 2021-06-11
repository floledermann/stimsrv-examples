
const pause = require("stimsrv/task/pause");
const sloan = require("stimsrv/task/sloan");
const text = require("./text.js");
const mapTask = require("stimsrv-task-slippymap");

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
      id: "anyone",
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
      id: "kindle",
      client: "browser-simple",
      imageType: "jpeg",
      imageQuality: 40,
      resolution: "hd",
      imageSize: "1260x1480",
      pixeldensity: 91,
      viewingdistance: 350,
    },
  ],
  
  roles: [
    {
      role: "display",
      description: "Stimulus display on modern browsers",
      interfaces: ["display"],
      devices: ["anyone"]
    },
    {
      role: "display-oldbrowser",
      description: "Stimulus display on old browser",
      interfaces: ["display"],
      devices: ["anyone","old","kindle","old2"]
    },
    {
      role: "response",
      description: "Response",
      interfaces: ["response"],
      devices: ["anyone"]
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

    // even complex UIs like a slippy map can be shown on simple browsers
    // make sure to generate a response whenever the map should update, because this triggers re-rendering for old browsers
    mapTask({
      tiles: {
        tileURL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      },
      synchronize: true,
      // define task functions for map task - by default, slippymap task doesn't define these
      initialize: (parent, stimsrv, map, context) => {
        // only trigger when *user* moves the map, not when moved through sync
        map.addUserEventListener("moveend", () => stimsrv.response({center:map.getCenter(),zoom:map.getZoom()}));
      },
      render: (condition, map, context) => {
        map.setView(condition.center, condition.zoom);
      },
      controller: context => ({
        // send out the response as condition, to trigger sync of old browsers
        nextCondition(lastCondition, response) {
          return response || {center:[0,0],zoom:2};
        }
      })
    }),
        
    pause({
      message: "Restart...",
    }),

    
  ]
}