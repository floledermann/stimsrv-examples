
const simpleTask = require("stimsrv/task/simpleTask");
const htmlButtons = require("stimsrv/ui/htmlButtons");
const canvasRenderer = require("stimsrv/stimulus/canvas/canvasRenderer");


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


// Function for rendering the stimulus
// When this is called, a drawing context has been initialized (first parameter),
// units have been converted to pixel values, fonts are loaded,
// and the rotate and transform properties have been applied to the canvas.
// So this code can be kept simple.
function renderText(ctx, condition) {
  
  ctx.textAlign = "center";
  ctx.font = `${condition.fontSize}px ${condition.fontFamily}`;

  ctx.fillText(condition.text, 0, 0);
  
}


// The canvasRenderer provides built-in functionality
// such as conversion of dimensions and intensities and loading fonts
let renderer = config => canvasRenderer(renderText, {
  dimensions: ["fontSize"],                               // properties that should be converted as dimension (using context.pixelDensity)
  fonts: config.fonts                                     // fonts to load
});


let task = simpleTask({
  name: "text",
  description: "Text",
  defaults: DEFAULTS,
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
