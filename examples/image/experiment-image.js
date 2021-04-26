
const image = require("stimsrv/task/image");
const pause = require("stimsrv/task/pause");

const random = require("stimsrv/controller/random");
const sequence = require("stimsrv/controller/sequence");

const resource = require("stimsrv/util/resource");

module.exports = {
  
  name: "Image example",
  
  // we need to serve our images - this can be defined here or in each task
  resources: "images",
    
  tasks: [
  
    // basic usage of the image task - show a sequence of images with a "next" button
    image({
      image: random.sequence(["A.png", "B.png", "C.png"]),
      baseURL: resource.url("images")
    }),
    
    pause({ message: "Click Continue to restart experiment..." }),
    
  ],
  
}