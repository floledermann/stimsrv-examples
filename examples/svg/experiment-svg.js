
const pause = require("stimsrv/task/pause");
const svgRenderer = require("./svgRenderer.js");

const random = require("stimsrv/controller/random");
const sequence = require("stimsrv/controller/sequence");

const resource = require("stimsrv/util/resource");

module.exports = {
  
  name: "SVG example",
  
  tasks: [
  
    // mockup how this should work
    simpleTask({
      name: "SVG Test",
      conditions: {
        svg: random.sequence(["A.png", "B.png", "C.png"]),
        count: random.pick([1,2,3,4,5,6,7]),
        lineWidth: random.shuffle(LINE_WIDTHS, {multiple: STEP_COUNT }),
      },
      transformCondition: context => condition => {},
      transformConditionOnClient: ,
      interfaces: {  
        display: svgRenderer({
          dimensions: "lineWidth",
          augmentSVG: augmentSVG,
          baseURL: resource.url("svgs"),
        }),
        response: htmlButtons({
          buttons: "0,1,2,3,4,5,6,7,8,9,10,11,12".split(",").map(
            n => ({label: n, response: { count: +n }})
          )
        })
      }, 
      resources: ["svgs"]
    }),
    
    pause({ message: "Click Continue to restart experiment..." }),
    
  ],
  
}

function augmentSVG(svg, condition, context) {
     
  function use(id, parent) {
    let use = svg.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#" + id);
    parent.appendChild(use);       
  }

  if (!condition.baseMap) {
    svg.rootElement.style.backgroundColor = "#ffffff";
    let layers = svg.querySelectorAll('svg > g');
    console.log(layers.length);
    for (let l of layers) {
      if (l.getAttribute("id") != "map: multipoint_rural") l.parentElement.removeChild(l);
    }
  }
  
  let similars = [
    [1,2,3,0],
    [2,3,1,0],
    [3,2,1,0]
  ][condition.kind-1];

  let unitsPerPixel = svg.rootElement.viewBox.baseVal.width / condition.width;
  
  let w = condition.lineWidth * unitsPerPixel;
  
  let layer1_1 = svg.rootElement.getElementById("layer-1-part-1");
  layer1_1.setAttribute("stroke-width",w);
  let layer2_1 = svg.rootElement.getElementById("layer-2-part-1");
  layer2_1.setAttribute("stroke-width",w);
  let layer2_2 = svg.rootElement.getElementById("layer-2-part-2");
  layer2_2.setAttribute("stroke-width",w*0.333);
  let layer3_1 = svg.rootElement.getElementById("layer-3-part-1");
  layer3_1.setAttribute("stroke-width",w);
  let layer3_2 = svg.rootElement.getElementById("layer-3-part-2");
  layer3_2.setAttribute("stroke-width",w*0.666);
  let layer3_3 = svg.rootElement.getElementById("layer-3-part-3");
  layer3_3.setAttribute("stroke-width",w*0.2);
      
  for (let i=0; i<condition.numLocations; i++) {
    
    let kind = similars[condition.indices[i]];
    
    let id = "road" + ((i+1)+"").padStart(2, "0");
    let el = svg.rootElement.getElementById(id);
    
    if (kind == 0) el.style.display = "none";
    if (kind == 1) {}; // no change needed
    if (kind == 2) {
      use(id, layer2_1);
      use(id, layer2_2);
    };
    if (kind == 3) {
      use(id, layer3_1);
      use(id, layer3_2);
      use(id, layer3_3);  
    };
  };
};