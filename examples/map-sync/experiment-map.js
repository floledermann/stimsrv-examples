
const mapTask = require("stimsrv-task-slippymap");

module.exports = {
  
  name: "Map movemet synchronization across devices",
    
  tasks: [
  
    mapTask({
      synchronize: true,
      synchronizeView: "centerZoom",
      tiles: {
        tileURL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      },
    }),
    
  ]
}