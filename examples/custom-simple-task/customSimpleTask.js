
const simpleTask = require("stimsrv/task/simpleTask");
const htmlButtons = require("stimsrv/ui/htmlButtons");
const canvasRenderer = require("stimsrv/stimulus/canvas/canvasRenderer");

// A simplified version of the "text" task, for demonstrating the 
// implementation of custom tasks using the simpleTask helper


// Defaults for the task. These include properties of the condition and the task configuration.
const DEFAULTS = {
  
  // condition
  
  text: "<no text defined>",
  fontSize: "4mm",
  fontFamily: "Arial",
  
  backgroundIntensity: 1.0,
  foregroundIntensity: 0.0,
  
  // config
  
  displayInterface: "display", 
  responseInterface: "response",
  monitorInterface: "monitor",
  // fonts
  // css
};


// Function for rendering the stimulus using a HTML Canvas.
// A CanvasContext2D drawing context is passed as the first parameter, the current condition as the second.
// The "rotate" and "transform" properties of the condition have been applied to the drawing context.
// Properties of the condition specified as dimensions (see below) have been converted to pixel values.
// Fonts have been loaded.
function renderText(ctx, condition) {
  
  ctx.textAlign = "center";
  ctx.font = `${condition.fontSize}px ${condition.fontFamily}`;

  ctx.fillText(condition.text, 0, 0);
  
}


// The canvasRenderer provides built-in functionality
// such as conversion of dimensions and intensities and loading fonts
let renderer = config => canvasRenderer(renderText, {
  dimensions: ["fontSize"],   // properties that should be converted from dimensions to pixels (using context.pixelDensity)
  fonts: config.fonts         // fonts to load
});


// The actual task definition, using the simpleTask helper
let task = simpleTask({
  name: "text",
  description: "Text",
  defaults: DEFAULTS,
  // The interfaces the task provides.
  // These can be remapped by the user by using the "<interfaceName>Interface" configuration properties.
  interfaces: {
    display: renderer,
    monitor: renderer,
    response: config => htmlButtons({
      buttons: condition => condition.choices.map(
        choice => ({
          label: choice,
          response: {text: choice} 
        })
      ),
      css: config.css
    }),
  },
  resources: "fonts"
});


module.exports = task;
