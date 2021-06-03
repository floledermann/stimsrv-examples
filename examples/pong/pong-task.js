
function pongUI(config) {
  return function(context) {
    return {
      interfaces: {
        "display": pongPlayer(config, context),
        "monitor": pongSupervisor(config, context)
      }
    }
  }
}

function pongPlayer(config, context) {
  
  let ctx = null;
  
  let paddlePos = [];
  
  let numClients = 0;
  let clientNum = 0;
  
  let xfPlayer = null;
  let xfView = null;
  
  let distanceFromCenter = 0;
  
  let width = 0;
  let height = 0;
  
  let walls = [];
  let sides = 0;
  let side = 0;
  
  const {
    paddleSize = 100,
    edgeSize = 1000,
    edgeMargin = 50,
    edgeWall = 100,
    ballSize = 5,
    wallWidth = 5,
    paddleWidth = 5
  } = config;
  
  return {
    initialize: (parent, stimsrv) => {
      
      let _window = parent.ownerDocument.defaultView;
      
      let canvas = parent.ownerDocument.createElement("canvas");
      let dppx = _window.devicePixelRatio || 1;
              
      width = parent.clientWidth * dppx;
      height = parent.clientHeight * dppx;
      
      canvas.width = width;
      canvas.height = height;
      
      canvas.style.width = parent.clientWidth + "px";
      canvas.style.height = parent.clientHeight + "px";

      parent.appendChild(canvas);
      
      ctx = canvas.getContext("2d");
      
      canvas.addEventListener("mousemove", pos);
      canvas.addEventListener("touchmove", pos);
      
      let lastMoveTime = 0;
      
      function pos(event) {
        let y = null;
        if (event.touches) {
          if (event.touches.length == 1) {
            var rect = canvas.getBoundingClientRect();
            y = event.touches[0].pageY - rect.top;
          }
        }
        else {
          y = event.offsetY;
        }
        if (y !== null) {
          y = new DOMPoint(0, y).matrixTransform(xfView.inverse()).y;
          let extent = (edgeSize - paddleSize)/2
          y = Math.min(extent, Math.max(-extent, y));
          paddlePos[side] = y;
          
          if (Date.now() - lastMoveTime > 20) {
            stimsrv.event("paddle", {clientNum: clientNum, pos: Math.trunc(paddlePos[side]), side: side});
            lastMoveTime = Date.now();
          }
        }
      }
      
      function drawSide(num) {
        
        let angle = (num - side) * 360 / sides;
        
        let xfSide = new DOMMatrix();
        xfSide.rotateSelf(0,0,angle);
        
        ctx.resetTransform();
        
        ctx.setTransform(xfView.multiply(xfSide));
        
        if (walls.includes(num)) {
          ctx.fillRect(distanceFromCenter, -edgeSize/2-wallWidth, wallWidth, edgeSize+2*wallWidth);
        }
        else {
        
          ctx.fillRect(distanceFromCenter, -edgeSize/2-wallWidth, wallWidth, edgeWall+wallWidth);
          ctx.fillRect(distanceFromCenter, edgeSize/2 - edgeWall, wallWidth, edgeWall+wallWidth);
          
          if (paddlePos[num]) {
            ctx.fillRect(distanceFromCenter - paddleWidth, paddlePos[num] - paddleSize / 2, paddleWidth, paddleSize);
          }
        }
      }
      
      function update() {
        if (distanceFromCenter > 0) {
          
          ctx.resetTransform();
          
          ctx.fillStyle = "#000000";
          ctx.fillRect(0,0,width,height);

          ctx.fillStyle = "#ffffff";
          ctx.strokeStyle = "#ffffff";  

          ctx.setTransform(xfView);
          
          ctx.fillRect(-ballSize/2,-ballSize/2, ballSize, ballSize);

          for (let num = 1; num <= sides; num++) {
            drawSide(num);
          }
          /*
          ctx.beginPath();
          ctx.moveTo(distanceFromCenter,-edgeSize/2);
          ctx.lineTo(distanceFromCenter, edgeSize/2);
          ctx.stroke();
          */
        }    

        _window.requestAnimationFrame(update);        
      }
      
      _window.requestAnimationFrame(update);
      
    },
    render: condition => {
      //textEl.innerHTML += "<br>" + condition.text;
    },
    event: (type, data) => {
      console.log("Event: ", type, data);
      if (type == "client join" || type == "client leave") {
        numClients = data.numClients;
        clientNum = data.clientNum;
        
        sides = numClients;
        side = clientNum;
        
        walls = [];
        if (sides < 3) {
          sides = 4;
          // make second player opposite
          if (side == 2) side = 3;
          walls = [2,4]
          if (numClients == 1) walls.push(3);
        }
        // inner radius (distance from center point to edge)
        distanceFromCenter = edgeSize / 2 / Math.tan(Math.PI / sides);
        let angle = (side - 1) * Math.PI * 2 / sides;
        
        let scaleFactor = height / (edgeSize + 2 * edgeMargin);
        xfView = new DOMMatrix();
        xfView.translateSelf(width / 2, height / 2);
        xfView.scaleSelf(scaleFactor, scaleFactor);
        xfView.translateSelf(Math.min(0, width / 2 - (distanceFromCenter + edgeMargin) * scaleFactor) / scaleFactor);
        
      }
      if (type == "paddle" && data.side != side) {
        paddlePos[data.side] = data.pos;
      }
    }
  }
}

function pongSupervisor(config, context) {
  return {
    initialize: (parent, stimsrv) => {
    },
    render: condition => {
    }
  }
}

function pongController(config) {
  return function(context) {
    return {
      nextCondition: (lastCondition, lastResponse, conditions, responses) => {
        return lastCondition ? null : {};
      }
    }
  }
}

function pong(config) {
  return {
    name: "task2",
    ui: pongUI(config),
    controller: pongController(config)
  }
}
    
module.exports = pong;