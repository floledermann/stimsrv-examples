
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
  let xfPlayerInverse = null;
  let xfView = null;
  let xfReflect = new DOMMatrix().scaleSelf(-1,1,1);
  let xfNormalize = null;
  
  let distanceFromCenter = 0;
  
  let width = 0;
  let height = 0;
  
  let walls = [];
  let sides = 0;
  let side = 0;
  
  let ballPosition = new DOMPoint(0,0);
  let ballVector = null;
  let ballTarget = null;
  
  const {
    paddleSize = 100,
    edgeSize = 1000,
    edgeMargin = 50,
    edgeWall = 100,
    ballSize = 5,
    wallWidth = 5,
    paddleWidth = 5,
    initialBallVector = [2,0.2],
  } = config;
  
  // this must be pointing towards player 1!
  if (initialBallVector[0] < 0) initialBallVector[0] *= -1;
  if (initialBallVector[0] == 0) initialBallVector[0] = 1;
  if (Math.abs(initialBallVector[1]) > initialBallVector[0]) initialBallVector[1] = initialBallVector[0] * 0.9;
  
  let stimsrv = null;
  
  return {
    initialize: (parent, _stimsrv) => {
      
      stimsrv = _stimsrv;
      
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
            y = (event.touches[0].pageY - rect.top) * dppx;
          }
        }
        else {
          y = event.offsetY;
        }
        if (y !== null) {
          y = new DOMPoint(0, y).matrixTransform(xfView.inverse()).matrixTransform(xfNormalize).y; //.matrixTransform(xfNormalize.inverse()).y;
          //console.log(y);
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
        
        //if (num != side) return;
        //let xfSide = getSideXf(num-side+1);
        let xfSide = getSideXf(num).inverse();
        
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
      
      function getSideXf(sideNum) {
        // because playfield is already rotated, take that into account for each side
        let angle = (sideNum-1) / sides * 360;
        let xfSide = new DOMMatrix();
        xfSide.rotateSelf(0,0,angle); 
        return xfSide;
      }
      
      let collisionPoints = [];
      
      function update() {
        if (distanceFromCenter > 0 && ballVector) {
          
          ctx.resetTransform();
          
          ctx.fillStyle = "#000000";
          ctx.fillRect(0,0,width,height);

          ctx.fillStyle = "#ffffff";
          ctx.strokeStyle = "#ffffff";

          ctx.fillText(side, 20, 20);          

          ctx.setTransform(xfView);
          
          //console.log(xfView);
          
          for (let p of collisionPoints) {
            ctx.fillRect(p.x-ballSize,p.y-ballSize, ballSize*2, ballSize*2);
          }
          
          if (ballVector) {
            ballPosition.x += ballVector.x;
            ballPosition.y += ballVector.y;
          }
          
          //console.log(ballPosition.matrixTransform(xfView));
          ctx.fillRect(ballPosition.x-ballSize/2,ballPosition.y-ballSize/2, ballSize, ballSize);
          ctx.fillRect(500,500, ballSize, ballSize);

          let ballRelPos = ballPosition.matrixTransform(xfNormalize);
          let ballRelVec = ballVector.matrixTransform(xfNormalize);
          
          // targeted user is responsible for collision checking
          if (ballTarget == clientNum) {
            let hit = false;

            // paddle hit ?
            if (ballRelPos.x+ballSize/2 >= distanceFromCenter-paddleWidth) {
              if ((ballRelPos.y+ballSize/2 > paddlePos[side]-paddleSize/2) &&
                  (ballRelPos.y-ballSize/2 < paddlePos[side]+paddleSize/2)) {
                
                hit = true;
                
                let xfSlice = new DOMMatrix().translateSelf(0,0.5);
                ballVector = ballVector.matrixTransform(xfNormalize).matrixTransform(xfReflect).matrixTransform(xfSlice).matrixTransform(xfNormalize.inverse());
              }
            }
            // wall hit?
            if (!hit && ballRelPos.x+ballSize/2 >= distanceFromCenter) {
              if ((ballRelPos.y-ballSize/2 < -edgeSize/2+edgeWall) ||
                  (ballRelPos.y+ballSize/2 > edgeSize/2-edgeWall)) {
                    
                hit = true;
                
                ballVector = ballVector.matrixTransform(xfNormalize).matrixTransform(xfReflect).matrixTransform(xfNormalize.inverse());
              }
            }
            // 1-2 player walls
            for (let wallNum of walls) {
              
              let xfWall = getSideXf(wallNum);
              
              let wallBallPos = ballPosition.matrixTransform(xfWall);
              if (wallBallPos.x+ballSize/2 > distanceFromCenter) {
                ballVector = ballVector.matrixTransform(xfWall).matrixTransform(xfReflect).matrixTransform(xfWall.inverse());
                stimsrv.event("ball", { dir: [ballVector.x, ballVector.y], target: ballTarget });
              }
            }
            
            ballRelVec = ballVector.matrixTransform(xfNormalize);
            
            if (hit) {
              if (numClients == 2) {
                ballTarget = ballTarget == 1 ? 2 : 1;
              }
              if (numClients > 2) {
                // intersect ball trajectory with each side to find target
                debugger;
                collisionPoints = [];
                for (let s=1; s<=numClients; s++) {
                  if (s == clientNum) continue;
                  let xf = getSideXf(s);
                  //let angle = (side-1) / sides * 360;
                  //let xf = new DOMMatrix();
                  //xf.rotateSelf(0,0,angle); 
                  let v = ballVector.matrixTransform(xf);
                  let pos = ballPosition.matrixTransform(xf);
                  let ox = distanceFromCenter;
                  let oy = -edgeSize/2;
                  let dy = edgeSize;
                  // b = (vy*(ox-px) - vx*(oy+py)) / (dy*vx - dx*vy)
                  // dx == 0 -> b = (vy*(ox-px) - vx*(oy+py)) / dy*vx
                  let b = (v.y*(ox-pos.x) - v.x*(oy-pos.y)) / (dy*v.x);
                  
                  let p = new DOMPoint(distanceFromCenter, -edgeSize/2 + b*edgeSize);
                  p = p.matrixTransform(xf.inverse());
                  //p = p.matrixTransform(xfPlayer.inverse());
                  collisionPoints.push(p);
                  
                  
                  console.log("b: " + b);
                  if (b >= 0 && b <= 1) {
                    ballTarget = s;
                    console.log("New ballTarget: " + s);
                    
                    break;
                  }
                }

              }
              stimsrv.event("ball", { dir: [ballVector.x, ballVector.y], target: ballTarget });
            }
            else {
            }
          }
          

          if (ballVector) {
            drawLine(ballPosition.x,ballPosition.y,ballPosition.x+ballVector.x*1000,ballPosition.y+ballVector.y*1000);
          }
          
          for (let num = 1; num <= sides; num++) {
            drawSide(num);
          }
        }    

        _window.requestAnimationFrame(update);        
      }
      
      function drawLine(x1,y1,x2,y2) {
        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.stroke();
      }
      
      _window.requestAnimationFrame(update);
      
    },
    render: condition => {
      //textEl.innerHTML += "<br>" + condition.text;
    },
    event: (type, data) => {
      //console.log("Event: ", type, data);
      if (type == "client join" || type == "client leave") {
        numClients = data.numClients;
        clientNum = data.clientNum;
        
        console.log("Client: ", clientNum);
        
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
        xfView.rotateSelf(0,0,((side-1) / sides * 360 ));
        //console.log(((side-1) * 360 / sides));
        xfView.translateSelf(Math.min(0, width / 2 - (distanceFromCenter + edgeMargin) * scaleFactor));
        xfView.scaleSelf(scaleFactor, scaleFactor);
        //xfView.scaleSelf(0.5, 0.5);
        
        xfNormalize = new DOMMatrix();
        xfNormalize.rotateSelf(0,0,(side-1) / sides * 360);
        
        xfPlayer = new DOMMatrix();
        //xfPlayer.rotateSelf(0,0,(side-1) * 360 / sides);
        xfPlayerInverse = xfPlayer.inverse();
        //xfView.translateSelf(Math.min(0, width / 2 - (distanceFromCenter + edgeMargin) * scaleFactor) / scaleFactor);
        
        if (!ballVector && clientNum == 1) {
          ballVector = new DOMPoint(initialBallVector[0], initialBallVector[1]);
          ballPosition = new DOMPoint(0,0);
          ballTarget = 1;
        }
        // current target is responsible for ball updates -> send out to new client
        if (ballTarget == clientNum) {
          stimsrv.event("ball", {dir: [ballVector.x, ballVector.y], pos: [ballPosition.x, ballPosition.y], target: ballTarget});
        }
      }
      if (type == "paddle" && data.side != side) {
        paddlePos[data.side] = data.pos;
      }
      if (type == "ball") {
        ballVector = new DOMPoint(data.dir[0], data.dir[1]);
        ballTarget = data.target;
        if (data.pos) {
          ballPosition = new DOMPoint(data.pos[0], data.pos[1]);
        }
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