## stimsrv Examples

!! | This is alpha software, not ready to use. | !!
---|-------------------------------------------|---

This repository contains some examples for [stimsrv](https://github.com/floledermann/stimsrv).

stimsrv (***stim***ulus ***s***e***rv***er) is a system for running browser-based psychological experiments and user studies.

### Running the examples

Clone/[download](https://github.com/floledermann/stimsrv-examples/archive/refs/heads/main.zip) the repository, and run

```
npm install
```

in the stimsrv-examples directory (or double-click `setup.bat` on Windows).

Then, in each example directory, you can run

```
npx stimsrv --open <example-file>
```

On Windows, you can also drag the example file onto the provided `launch.bat` file, or double click `launch.bat` to launch the first example in the directory.

The `--open` option will launch a browser window showing the experiment start page.

You can end stimsrv by pressing `Ctrl-C` (repeatedly) in the console window.

Make sure to always only run one experiment at a time, otherwise stimsrv will crash with a "port in use" error message.


### Examples

#### /examples/loop/

Example experiment showing (nested) loops and dynamic context.

#### /examples/minimal/

Minimal experiment file, showing only a "hello world" message.
