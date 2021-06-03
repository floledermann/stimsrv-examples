
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
  
  let paddlePos = 0;
  
  let numClients = 0;
  let clientNum = 0;
  
  let xfPlayer = null;
  let xfView = null;
  
  let distanceFromCenter = 0;
  
  let width = 0;
  let height = 0;
  
  config = Object.assign({
    paddleSize: 100,
    edgeSize: 1000,
    edgeMargin: 50,
    edgeWall: 100,
    ballSize: 5,
    wallWidth: 5,
    paddleWidth: 5
  }, config);
  
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

      let scaleFactor = height / (config.edgeSize + 2 * config.edgeMargin);
      xfView = new DOMMatrix();
      xfView.translateSelf(width / 2, height / 2);
      xfView.scaleSelf(scaleFactor, scaleFactor);

      parent.appendChild(canvas);
      
      ctx = canvas.getContext("2d");
      
      canvas.addEventListener("mousemove", pos);
      
      let lastMoveTime = 0;
      
      function pos(event) {
        let y = event.offsetY;
        y = new DOMPoint(0, y).matrixTransform(xfView.inverse()).y;
        let extent = (config.edgeSize - config.paddleSize)/2
        y = Math.min(extent, Math.max(-extent, y));
        paddlePos = y;
        
        if (Date.now() - lastMoveTime > 100) {
          stimsrv.event("paddle", {clientNum: clientNum, pos: paddlePos});
          lastMoveTime = Date.now();
        }
      }
      
      function update() {
        if (distanceFromCenter > 0) {
          
          console.log("drawing!");
          
          ctx.resetTransform();
          
          ctx.fillStyle = "#000000";
          ctx.fillRect(0,0,width,height);
          
          ctx.setTransform(xfView);
          ctx.fillStyle = "#ffffff";
          ctx.strokeStyle = "#ffffff";
          
          ctx.fillRect(-config.ballSize/2,-config.ballSize/2, config.ballSize, config.ballSize);
          
          ctx.fillRect(distanceFromCenter, -config.edgeSize/2, config.wallWidth, config.edgeWall);
          ctx.fillRect(distanceFromCenter, config.edgeSize/2 - config.edgeWall, config.wallWidth, config.edgeWall);
          
          ctx.fillRect(distanceFromCenter - config.paddleWidth, paddlePos - config.paddleSize / 2, config.paddleWidth, config.paddleSize);
          
          /*
          ctx.beginPath();
          ctx.moveTo(distanceFromCenter,-config.edgeSize/2);
          ctx.lineTo(distanceFromCenter, config.edgeSize/2);
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
        
        let sides = numClients;
        if (sides < 3) {
          sides = 4;
          // make second player opposite
          if (clientNum == 2) clientNum = 3;
        }
        // inner radius (distance from center point to edge)
        distanceFromCenter = config.edgeSize / 2 / Math.tan(Math.PI / sides);
        let angle = (clientNum - 1) * Math.PI * 2 / sides;
        
        xfPlayer = new DOMMatrix();
        xfPlayer.rotateSelf(0,0,angle);
        
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