
const mapTask = require("stimsrv-task-slippymap");

module.exports = {
  
  name: "Map movemet synchronization across devices",
    
  tasks: [
  
    mapTask({
      tiles: {
        tileURL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      },
      synchronize: true,
      synchronizeView: "centerZoom", // or "bounds"
      // define task functions for map task - by default, slippymap task doesn't define these
      // for example, trigger a response when user stops panning
      initialize: (parent, stimsrv, map, context) => {
        map.addEventListener("mouseup", () => stimsrv.response({center:map.getCenter(),zoom:map.getZoom()}));
      },
      render: (condition, map, context) => {
        // TODO: render the condition
        console.log("Map task condition ", condition);
      },
      controller: context => ({
        // TODO: define a suitable controller for generating conditions
        // here, we simply send back the last response
        nextCondition(lastCondition, lastResponse) {
          return lastResponse || {center:[0,0],zoom:2};
        }
      })
    }),
    
  ]
}