
const pause = require("stimsrv/task/pause");

module.exports = {
  
  name: "Minimal Experiment Example",
    
  tasks: [
  
    pause({
      message: "Hello from stimsrv",
      store: true,  // by default, the pause task is not stored - store it so that we have some data
    }),
    
    pause({
      message: "Goodbye from stimsrv",
    })
    
  ]
}