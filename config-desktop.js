const filestorage = require("stimsrv/src/storage/filestorage.js");

module.exports = {
  devices: [
    {
      name: "Main PC",
      id: "main",
      ip: ".",
      platform: "browser", // browser-old, browser-nojs, pdf, png
      screens: [
        {
          id: "main",
          description: "Laptop internal monitor",
          resolution: "hd",
          pixeldensity: 157,
          viewingdistance: 500,
          gamma: 2.2,
          minintensity: 1/40
        }
      ],
      mouse: true,
      keyboard: true
    }
  ],
  
  roles: [
    {
      role: "supervisor",
      device: "main",
      interfaces: ["monitor", "control"],
      description: "Supervisor screen and experiment control"
    },
    {
      role: "experiment",
      device: "main",
      interfaces: ["display","response"],
      description: "Experiment screen for stimulus display and participant response"
    },
    {
      role: "experiment-debug",
      device: "main",
      interfaces: ["display","response","debug"],
      description: "Experiment screen with debugging output"
    }
  ],
  
  storage: filestorage({
    destination: "./data",
    format: "json"
  })

}