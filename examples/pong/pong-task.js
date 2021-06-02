
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
  let paddleSize = 100;
  let edgeSize = 1000;
  
  return {
    initialize: (parent, stimsrv) => {
      
      let canvas = parent.ownerDocument.createElement("canvas");
      let dppx = parent.ownerDocument.defaultView.devicePixelRatio || 1;
              
      canvas.width = parent.clientWidth * dppx;      
      canvas.height = parent.clientHeight * dppx;
      
      canvas.style.width = parent.clientWidth + "px";
      canvas.style.height = parent.clientHeight + "px";

      parent.appendChild(canvas);
      
      ctx = canvas.getContext("2d");
      
      canvas.addEventListener("mousemove", pos);
      
      function pos(event) {
      }
      
    },
    render: condition => {
      textEl.innerHTML += "<br>" + condition.text;
    },
    event: event => {
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