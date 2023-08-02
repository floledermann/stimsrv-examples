const resource = require("stimsrv/util/resource");
const displayConfig = require("stimsrv/stimulus/displayConfig");

const svgRenderer = options => {

  options = Object.assign({
    dimensions: [],
    defaultDimensions: ["width", "height"],
  }, options);

  options.dimensions = options.dimensions.concat(options.defaultDimensions);
  
  let parent = null;
  let document = null;
  let dppx = 1;
  
  let renderer = function(context) {
    
    let display = displayConfig(Object.assign({}, options, {
      warnDefaults: options.warn
    }))(context);

    return {
      initialize: function(_parent) {
        parent = _parent;
        document = parent.ownerDocument;
        dppx = document.defaultView.devicePixelRatio || 1; 
      },
      
      render: function(condition) {
        
        let svg = document.createElement("object");
        svg.style.visibility = "hidden";
        
        //let header = document.createElement("header");
        let pixelsPerMM = display.dimensionToScreenPixels("1mm") / dppx;
        
        /*
        header.innerHTML = 'Count: ' + svgStr(condition.kind, pixelsPerMM) + ' Road Segments';
        header.style.fontSize = (display.dimensionToScreenPixels("4mm") / dppx) + "px";
        parent.style.backgroundColor = "rgb(90%,90%,90%)";
        header.style.color = "#000000";
        header.style.marginBottom = (pixelsPerMM) + "px";
        //header.style.position = "absolute";
        */
        
        for (let key of options.dimensions) {
          console.log("Dimension: ", key, condition[key]);
          condition[key] = display.dimensionToScreenPixels(condition[key], condition);
        }

        svg.width = condition.width / dppx;
        svg.height = condition.height / dppx;
        svg.data = resource.url(condition.svg);
        
        svg.addEventListener("load", e => {
          if (options.augmentSVG) options.augmentSVG(svg.getSVGDocument(), condition, context);
          svg.style.visibility = "visible";
        });
        
        parent.innerHTML = "";
        //parent.appendChild(header);
        parent.appendChild(svg);
      }
    }
  }
  
  return renderer;
  
}


let renderer = config => svgRenderer({
  dimensions: ["lineWidth"]
});

module.exports = svgRenderer;