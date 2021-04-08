
const pause = require("stimsrv/src/tasks/pause.js");

module.exports = {
  
  name: "Minimal Experiment Example",
    
  tasks: [
  
    pause({
      message: "Hello stimsrv",
      store: true  // by default, the pause task is not stored - store it so that we have some data
    })
    
  ]
}