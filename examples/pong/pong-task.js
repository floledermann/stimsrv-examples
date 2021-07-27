
function pongFrontend(config) {
  return context => ({
    interfaces: {
      "display": pongPlayer(config, context),
      "monitor": pongSupervisor(config, context)
    }
  });
}

function pongPlayer(config, context) {
  
  let ctx = null;
  
  let paddlePos = [];
  
  let numClients = 0;
  let clientNum = 0;
  
  let score = [];
  
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
    paddleSize = 50,
    edgeSize = 500,
    edgeMargin = 50,
    edgeWall = 50,
    ballSize = 5,
    wallWidth = 5,
    paddleWidth = 5,
    paddleDist = 1,
    initialBallVector = [3,0],
    sliceStrength = 3,
    nonSliceStrength = 0.5
  } = config;
  
  // this must be pointing towards player 1!
  if (initialBallVector[0] < 0) initialBallVector[0] *= -1;
  if (initialBallVector[0] == 0) initialBallVector[0] = 1;
  if (Math.abs(initialBallVector[1]) > initialBallVector[0]) initialBallVector[1] = initialBallVector[0] * 0.9;
  
  let stimsrv = null;
  
  function setupViewMatrix() {
    let scaleFactor = height / (edgeSize + 2 * edgeMargin);
    xfView = new DOMMatrix();
    xfView.translateSelf(width / 2, height / 2);
    xfView.translateSelf(Math.min(0, width / 2 - (distanceFromCenter + edgeMargin) * scaleFactor));
    xfView.rotateSelf(0,0,((side-1) / sides * 360 ));
    xfView.scaleSelf(scaleFactor, scaleFactor);
    
    xfNormalize = new DOMMatrix();
    xfNormalize.rotateSelf(0,0,(side-1) / sides * 360);
  }
  
  return {
    initialize: (parent, _stimsrv) => {
      
      stimsrv = _stimsrv;
      
      let _window = parent.ownerDocument.defaultView;
      
      let canvas = parent.ownerDocument.createElement("canvas");
      let dppx = _window.devicePixelRatio || 1;
      
      function resize() {
                
        width = parent.clientWidth * dppx;
        height = parent.clientHeight * dppx;
        
        canvas.width = width;
        canvas.height = height;
        
        canvas.style.width = parent.clientWidth + "px";
        canvas.style.height = parent.clientHeight + "px";

      }
      
      resize();        

      parent.appendChild(canvas);

      let observer = new ResizeObserver((entries) => {
        resize();
        setupViewMatrix();
      });
      observer.observe(parent);      
      
      ctx = canvas.getContext("2d");
      
      canvas.addEventListener("mousemove", pos);
      canvas.addEventListener("touchmove", pos);
      
      let lastMoveTime = 0;
      let lastY = null;
      let paddleSpeed = 0;
      
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
          
          let dt = Date.now() - lastMoveTime;
          if (dt > 20) {
            let dist = 0;
            if (lastY !== null) {
              dist = y-lastY;
              paddleSpeed = dist/dt;
              //console.log("Paddle speed: " + paddleSpeed);
            }
            stimsrv.event("paddle", {clientNum: clientNum, pos: Math.trunc(paddlePos[side]), side: side});
            lastMoveTime = Date.now();
            lastY = y;
          }
        }
      }
      
      function drawSide(num) {
        
        //if (num != side) return;
        let xfSide = getSideXf(num).inverse();
        
        ctx.resetTransform();
        
        ctx.setTransform(xfView.multiply(xfSide));
        
        if (walls.includes(num)) {
          ctx.fillRect(distanceFromCenter, -edgeSize/2-wallWidth, wallWidth, edgeSize+2*wallWidth);
        }
        else {
        
          ctx.fillRect(distanceFromCenter, -edgeSize/2-wallWidth, wallWidth, edgeWall+wallWidth);
          ctx.fillRect(distanceFromCenter, edgeSize/2 - edgeWall, wallWidth, edgeWall+wallWidth);
          
          if (paddlePos[num] !== undefined) {
            ctx.fillRect(distanceFromCenter - paddleWidth - paddleDist, paddlePos[num] - paddleSize / 2, paddleWidth, paddleSize);
          }
        }
      }
      
      function getSideXf(sideNum) {
        let angle = (sideNum-1) / sides * 360;
        return new DOMMatrix().rotateSelf(0,0,angle);
      }
      
      function checkCollisions() {
        
        if (ballVector.x == 0 && ballVector.y == 0) return;
        
        let ballRelPos = ballPosition.matrixTransform(xfNormalize);
        
        let hit = false;

        // paddle hit ?
        if (ballRelPos.x+ballSize/2 >= distanceFromCenter-paddleWidth-paddleDist) {
          if ((ballRelPos.y+ballSize/2 > paddlePos[side]-paddleSize/2) &&
              (ballRelPos.y-ballSize/2 < paddlePos[side]+paddleSize/2)) {
            
            hit = true;
            
            let sliceX = -1*Math.max(0,(1-Math.abs(paddleSpeed))*nonSliceStrength);
            let sliceY = paddleSpeed*sliceStrength;
            
            let xfSlice = new DOMMatrix().translateSelf(sliceX, sliceY);
            ballVector = ballVector.matrixTransform(xfNormalize).matrixTransform(xfReflect).matrixTransform(xfSlice).matrixTransform(xfNormalize.inverse());
          }
        }
        // player edge wall hit?
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
          let wallBallDir = ballVector.matrixTransform(xfWall);
          
          // check if it goes into direction of wall, otherwise it has already been reflected
          if (wallBallPos.x+ballSize/2 > distanceFromCenter && wallBallDir.x > 0) {
            ballVector = ballVector.matrixTransform(xfWall).matrixTransform(xfReflect).matrixTransform(xfWall.inverse());
            stimsrv.event("ball", { dir: [ballVector.x, ballVector.y], pos: [ballPosition.x, ballPosition.y], target: ballTarget });
          }
        }
                    
        if (hit) {
          if (numClients == 2) {
            ballTarget = ballTarget == 1 ? 2 : 1;
          }
          if (numClients > 2) {
            // intersect ball trajectory with each side to find target
            for (let s=1; s<=numClients; s++) {
              // don't intersect for current player's edge
              if (s == clientNum) continue;
              
              let b = intersectSide(s);
              
              if (b >= 0 && b <= 1) {
                ballTarget = s;
                break;
              }
            }

          }
          // edge case for y==0, may reflect endlessly in corner
          if (ballVector.y == 0) ballVector.y = 0.001;
          stimsrv.event("ball", { dir: [ballVector.x, ballVector.y], pos: [ballPosition.x, ballPosition.y], target: ballTarget });
        }
        // no hit
        else {
          if (ballRelPos.x-ballSize/2 >= distanceFromCenter+2*ballSize) {
            // point lost
            ballVector = new DOMPoint(0,0);
            ballPosition = new DOMPoint(0,0);
            stimsrv.event("ball", {dir: [ballVector.x, ballVector.y], pos: [ballPosition.x, ballPosition.y], target: ballTarget});
            stimsrv.response({goal: clientNum, numClients: numClients});
            setTimeout(function() {
              ballVector = new DOMPoint(initialBallVector[0], initialBallVector[1]).matrixTransform(xfNormalize.inverse());
              stimsrv.event("ball", {dir: [ballVector.x, ballVector.y], pos: [ballPosition.x, ballPosition.y], target: ballTarget});
            }, 3000);
          }
        }
      }
      
      function intersectSide(side) {
        // intersect two lines, solving vector equation p+a*v = o+b*d, where
        // p: ball position relative to player side
        // v: ball vector relative to player side
        // o: origin of player's edge [distancefromCenter, -edgeSize/2]
        // d: vector along player's edge [0, edgeSize]
        //
        // so if 0 <= b <= 1, intersection is within player wall 
        
        let xf = getSideXf(side);
        let v = ballVector.matrixTransform(xf);
        let pos = ballPosition.matrixTransform(xf);
        let ox = distanceFromCenter;
        let oy = -edgeSize/2;
        let dy = edgeSize;
        // solving above equation gives
        // b = (vy*(ox-px) - vx*(oy+py)) / (dy*vx - dx*vy)
        // dx == 0 -> b = (vy*(ox-px) - vx*(oy+py)) / dy*vx
        let b = (v.y*(ox-pos.x) - v.x*(oy-pos.y)) / (dy*v.x);
        
        /*
        // for debugging purposes, store collision points for all sides
        // to potentially render later
        let p = new DOMPoint(distanceFromCenter, -edgeSize/2 + b*edgeSize);
        p = p.matrixTransform(xf.inverse());
        collisionPoints.push(p);
        */
        
        return b;
      }
      
      let lastUpdateTime = Date.now();
      
      function update() {
        if (distanceFromCenter > 0 && ballVector) {
          
          ctx.resetTransform();
          
          ctx.fillStyle = "#000000";
          ctx.fillRect(0,0,width,height);

          ctx.fillStyle = "#ffffff";
          ctx.strokeStyle = "#ffffff";

          ctx.font = "20px Arial";
          ctx.textBaseline = "top";
          ctx.textAlign = "center";
          
          ctx.scale(dppx, dppx);
          
          for (let i=0; i<numClients; i++) {
            ctx.fillText(score[i+1]||"0", 20 + i*30, 10);
            if (i+1 == clientNum) {
              drawLine(10+i*30,30,30+i*30,30);
            }              
          }
          
          ctx.setTransform(xfView);
          
          // targeted user is responsible for collision checking
          if (ballTarget == clientNum) checkCollisions();

          if (ballVector) {
            let dt = Date.now()-lastUpdateTime;
            
            ballPosition.x += ballVector.x * dt / 25;
            ballPosition.y += ballVector.y * dt / 25;
            
            lastUpdateTime = Date.now();
          }
          
          let ballInPlayfield = true;
          if (ballTarget != clientNum) {
            let targetSide = (numClients == 2 && ballTarget == 2) ? 3 : ballTarget;
            let xf = getSideXf(targetSide);
            let relPos = ballPosition.matrixTransform(xf);
            if (relPos.x > distanceFromCenter) {
              ballInPlayfield = false;
            }
          }
          if (ballInPlayfield) {
            // make ball edges orthogonal
            ctx.save();
            ctx.translate(ballPosition.x, ballPosition.y);
            ctx.rotate(-(side-1) / sides * Math.PI * 2);
            ctx.fillRect(-ballSize/2,-ballSize/2, ballSize, ballSize);
            ctx.restore();
          }  
          
          // draw line along ball vector for debugging
          //if (ballVector) {
          //  drawLine(ballPosition.x,ballPosition.y,ballPosition.x+ballVector.x*1000,ballPosition.y+ballVector.y*1000);
          //}
          
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
      score = condition.score;
      /*
      ballPosition = new DOMPoint(0,0);
      ballVector = new DOMPoint(0,0);
      ballTarget = condition.lastGoal || 1;
      if (ballTarget == clientNum) {
        setTimeout(function() {
          ballVector = new DOMPoint(initialBallVector[0], initialBallVector[1]).matrixTransform(xfNormalize.inverse());
          stimsrv.event("ball", {dir: [ballVector.x, ballVector.y], pos: [ballPosition.x, ballPosition.y], target: ballTarget});
        }, 3000);
      }
      */
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
        
        setupViewMatrix();
        
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
        // don't do "subordinate" updates if this client is currently in control
        if (data.target != clientNum || data.target != ballTarget) {
          ballTarget = data.target;
          ballVector = new DOMPoint(data.dir[0], data.dir[1]);        
          if (data.pos) {
            ballPosition = new DOMPoint(data.pos[0], data.pos[1]);
          }
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
        if (!lastCondition) return {score: []};
        let score = lastCondition.score.slice();
        if (lastResponse.goal) {        
          if (score[lastResponse.goal]) {
            score[lastResponse.goal]++;
          }
          else {
            score[lastResponse.goal] = 1;
          }
        }
        return {score: score, lastGoal: lastResponse.goal};
      }
    }
  }
}

function pong(config) {
  return {
    name: "task2",
    frontend: pongFrontend(config),
    controller: pongController(config)
  }
}
    
module.exports = pong;