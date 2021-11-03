
const pause = require("stimsrv/task/pause");
const text = require("stimsrv/task/text");

const staircase = require("stimsrv/controller/staircase");
const random = require("stimsrv/controller/random");

const htmlButtons = require("stimsrv/ui/htmlButtons");
const canvasRenderer = require("stimsrv/stimulus/canvas/canvasRenderer");


module.exports = {
  
  name: "Example for adapting response buttons",
    
  tasks: [
  
    text({
      // condition parameters
      angle: random.range(-60,60, {round: 1}),
      outline: true,
      backgroundIntensity: 0.5,
      outlineIntensity: 1,
      outlineWidth: 0.25,
      fontSize: staircase({
        startValue: "4.4mm",
        stepSize: 1.1,
        stepType: "multiply",
        minReversals: context => context.minReversals,
      }),
      
      // override the CSS for this task
      css: `
        .buttons {
          display: grid;
          grid-template-columns: repeat(1, 10em);
        }
        .buttons button {
          height: 4em;
          margin: 0.5em;
        }
        .buttons button .label {
          letter-spacing: 0.4em;
          margin-right: -0.4em;
          text-transform: uppercase;
        }
      `,
      
      // the task's user interfaces can be overridden here to adapt to your experiment
      // this function is expected to return an object with an entry for each interface
      // Interfaces provided by default can be removed by setting the corresponding entry to null
      interfaces: context => {
        // Override the response buttons to show a canvas rendering the stimulus for each button.
        // first, configure a canvasRenderer for this purpose:
        let buttonRenderer = canvasRenderer(text.render, {
          dimensions: ["fontSize"],
          intensities: ["outlineIntensity","outline2Intensity"],
          // make sure to specify width and height of the canvas in pixels
          width: 100,
          height: 40,
          // each condition received can be adapted to the button by overriding some of its properties
          overrideCondition: {
            angle: -10,
            backgroundIntensity: 1.0,
            fontSize: "6mm",
            outline: false
          }
        });
        // define our buttons, with one button for each choice (supplied by the condition)
        let responseButtons = htmlButtons({
          buttons: condition => condition.choices.map(
            c => ({
              label: c,
              response: {text: c},
              className: c == condition.text ? "correct" : "incorrect",
              // the canvasRenderer is used as a subUI of the button, which is added after the label
              subUI: buttonRenderer
            })
          ),
        });
        return {
          response: responseButtons
        }
      },
      
      // dynamic configuration: select word from hierarchical collection
      generateCondition: context => {
        
        // hierarchical set of generators - level 1: confusion category, level 2: set of words, level 3: word
        // words will be chosen alternating from the two sets, in random order of subset and word
        let wordCategories = random.loop([
          // e-a
          random.loop([
            random.loop(["Kamao","Kameo","Kemao","Kemeo"]),
            random.loop(["andarn","andern","endarn","endern"]),
            random.loop(["Rasta","Raste","Resta","Reste"])
          ]),
          // rn-m-nn
          random.loop([
            random.loop(["Lemos","Lennos","Lenos","Lernos"]),
            random.loop(["Semato","Senato","Sennato","Sernato"]),
            random.loop(["Kame","Kane","Kanne","Karne"])
          ]),
        ])(context);
                  
        return condition => {
          // get the next category, and from that the next set
          let set = wordCategories.next().value.next().value;
          return {
            text: set.next().value,
            choices: set.items
          }
        }
      }
    }),
        
    pause({
      message: "Experiment ended."
    }),
    
  ]
}