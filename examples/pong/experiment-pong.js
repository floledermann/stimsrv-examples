
const pong = require("./pong-task.js");

module.exports = {
  
  name: "Distributed Pong with stimsrv",
    
  roles: [{
    role: "experiment",
    devices: ["anyone"],
    interfaces: ["display"],
    fullscreenButton: true
  }],
  
  tasks: [
  
    pong({
    })
    
  ]
}