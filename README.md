## stimsrv Examples

This repository contains some examples for [stimsrv](https://github.com/floledermann/stimsrv).

stimsrv (***stim***ulus ***s***e***rv***er) is a system for running browser-based psychological experiments and user studies.

### Running the examples

Clone the repository, and run

```
npm install
```

(or double-click `setup.bat` on Windows).

Then, in each example directory, you can run

```
npx stimsrv --open <example-file>
```

On Windows, you can also drag the example file onto the provided `launch.bat` file, or double click `launch.bat` to launch the first example in the directory.

The `--open` option should launch a browser window showing the experiment start page.

You can end stimsrv by pressing Ctrl-C (repeatedly) in the console window.

Make sure to always only run one experiment at a time, otherwise stimsrv will crash with a "port in use" error message.


### Examples

#### /examples/loop/

Example for (nested) loops and dynamic context.