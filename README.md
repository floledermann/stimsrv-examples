## stimsrv Examples

This repository contains some example experiments for [stimsrv](https://github.com/floledermann/stimsrv).

**`stimsrv`** (***stim***ulus ***s***e***rv***er) is a system for running browser-based psychological experiments and user studies.

### Running the examples

Clone/[download](https://github.com/floledermann/stimsrv-examples/archive/refs/heads/main.zip) the repository, and run

```
npm install
```

in the stimsrv-examples directory (or double-click `install.bat` on Windows).

Then, in each example directory, you can run

```
npx stimsrv --open <example-file>
```

On Windows, you can also double click the provided `launch.bat` to launch the first experiment in a directory, or drag the desired experiment file onto `launch.bat`.

The `--open` option will open a browser window showing the experiment start page. Omit `--open` if you only want to start the server and want to start the client(s) manually.

You can end stimsrv by pressing `Ctrl-C` (repeatedly) in the console window, or by closing the window.

Make sure to always only run one experiment at a time, otherwise stimsrv will crash with a "port in use" error message.


### Examples in this repository

#### [/examples/a_minimal/](https://github.com/floledermann/stimsrv-examples/tree/main/examples/a_minimal)

A minimal experiment file, showing only a "hello world" message. Can be used as an empty starting point or to verify that the stimsrv installation is running without errors on your setup.

#### [/examples/custom-css/](https://github.com/floledermann/stimsrv-examples/tree/main/examples/custom-css)

Customizing an experiment's frontend by specifying custom CSS for devices, roles and tasks.

#### [/examples/custom-simple-task/](https://github.com/floledermann/stimsrv-examples/tree/main/examples/custom-simple-task)

Creating a custom task from using the `simpleTask` factory.

#### [/examples/custom-task/](https://github.com/floledermann/stimsrv-examples/tree/main/examples/custom-task)

Creating a custom task from scratch.

#### [/examples/image/](https://github.com/floledermann/stimsrv-examples/tree/main/examples/image)

Showing a series of images as stimuli.

#### [/examples/loop/](https://github.com/floledermann/stimsrv-examples/tree/main/examples/loop)

Example experiment showing (nested) loops and dynamic context.

#### [/examples/map-sync/](https://github.com/floledermann/stimsrv-examples/tree/main/examples/map-sync)

Synchronizing interaction with a web map across devices.

#### [/examples/pong/](https://github.com/floledermann/stimsrv-examples/tree/main/examples/pong)

Multiplayer PONG game, showing realtime events.

#### [/examples/simple-browser/](https://github.com/floledermann/stimsrv-examples/tree/main/examples/simple-browser)

Using stimsrv on old and simple devices, making use of server-side rendering with Puppeteer.

#### [/examples/sloan-acuity/](https://github.com/floledermann/stimsrv-examples/tree/main/examples/sloan-acuity)

Estimating visual acuity using [Sloan letters](https://en.wikipedia.org/wiki/Sloan_letters).


----

### Further examples in separate repositories

- ["find on map" experiment](https://github.com/floledermann/stimsrv-experiment-findonmap)
- [Wizard of Oz wayfinding](https://github.com/floledermann/stimsrv-experiment-wayfinding)



