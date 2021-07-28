
const pause = require("stimsrv/task/pause");

/*
This example shows the places you can inject CSS in your experiment
to customize the appearance of the UI.
*/

module.exports = {
  
  name: "CSS Override Example",
  
  // css property at the experiment level - applied on all clients
  css: `
/* CSS applied to the overall experiment. */

#interface-display .content {
  font-size: 2em;  /* double font size for "display" UI */
}

/* Some classes are set on the body element, reflecting the state of the experiment. */

/* body class is-device-X is set on device X. */
.is-device-anyone #interface-display .content {
  font-style: italic;
}

/* body class has-role-Y is set on all devices of role Y. */
.has-role-main #interface-display .content {
  font-weight: bold;
}

/* body class has-ui-Z is set on all devices that show UI Z. */
.has-ui-display #interface-response {
  /* Light green background for response ui that shows also the stimulus.*/ 
  background-color: #aaffaa;
}

/* body class current-task-T is set as long as task with name T is active. */
.current-task-task1 #interface-response {
  font-size: 2em;   /* double font size for response button for task 1. */
}
  `,

  devices: [
    {
      id: "anyone",
      // css property of each device
      css: `
/* CSS applied to the specific device (anyone). */
#interface-display .content::before {
  content: "(Device: anyone) ";
  font-size: 0.3em;
}
      `
    }
  ],
  
  roles: [
    {
      role: "main",
      description: "Main experiment display",
      interfaces: ["display","response"],
      devices: ["anyone"],
      // css property of each role
      css: `
/* CSS applied to the specific role (display). */
#interface-display .content::after {
  content: " (Role: main)";
  font-size: 0.3em;
}
      `
    }
  ],
  
  tasks: [
  
    pause({
      name: "task1",
      message: "This is task 1.",
      // css property of task - is only present as long as the task is active
      // (this depends on the task implementation, but is supported by most standard tasks)
      css: `
/* CSS applied as long as the task is active. */
/* The oder property can be used to reorder UI elements in the flexbox layout. */
#interface-display {
  order: 2;
}
#interface-response {
  order: 1;
}
      `,
      // the pause task lets you set style attributes of the message element 
      // through the messageStyle property, either as string 
      // or as a collection of CSS properties
      messageStyle: {
        color: "#ff3333" // red text color
      }
    }),
    
    pause({
      name: "task2",
      message: "This is task 2.",
      // css property of task - is only present as long as the task is active
      // (this depends on the task implementation, but is supported by most standard tasks)
      css: `
/* CSS applied as long as the task is active. */
/* The overall layout can be changed by controlling flexbox layout on the body.*/
body {
  flex-direction: row;
}
/* This can be combined e.g. with device selectors to adjust the UI. */
.is-device-anyone #interface-response {
  flex: 0 0 400px; /* Make response section 400px wide. */
}

      `,
    }),
    
  ]
}