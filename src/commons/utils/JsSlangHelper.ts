/* tslint:disable: ban-types*/
// import createSlangContext from 'calc-slang/dist/createContext';
// import { Context, Value, Variant } from 'calc-slang/dist/types';
import { Value, Variant } from '../../sml-slang-config';
import { Context } from 'sml-slang/src/types';
import EnvVisualizer from 'src/features/envVisualizer/EnvVisualizer';

import DataVisualizer from '../../features/dataVisualizer/dataVisualizer';
import { Data } from '../../features/dataVisualizer/dataVisualizerTypes';
import DisplayBufferService from './DisplayBufferService';

/**
 * This file contains wrappers for certain functions
 * in the @source-academy/slang module.
 *
 * Use this file especially when attempting to create a slang Context.
 */

/**
 * Function that takes a value and displays it in the interpreter.
 * It uses the calc-slang stringify to convert values into a "nicer"
 * output. e.g. [1, 2, 3] displays as [1, 2, 3].
 * An action is dispatched using the redux store reference
 * within the global window object.
 *
 * @param value the value to be displayed
 * @param workspaceLocation used to determine
 *   which REPL the value shows up in.
 */
function display(value: Value, str: string, workspaceLocation: any) {
  display((str === undefined ? '' : str + ' ') + value.toString(), '', workspaceLocation);
  return value;
}

/**
 * Function that takes a value and displays it in the interpreter.
 * The value is displayed however full JS would convert it to a string.
 * e.g. [1, 2, 3] would be displayed as 1,2,3.
 * An action is dispatched using the redux store reference
 * within the global window object.
 *
 * @param value the value to be displayed
 * @param workspaceLocation used to determine
 *   which REPL the value shows up in.
 */
function rawDisplay(value: Value, str: string, workspaceLocation: any) {
  const output = (str === undefined ? '' : str + ' ') + String(value);
  DisplayBufferService.push(output, workspaceLocation);

  return value;
}

/**
 * A function to prompt the user using a popup.
 * The function is not called 'prompt' to prevent shadowing.
 *
 * @param value the value to be displayed as a prompt
 */
function cadetPrompt(value: any) {
  return prompt(value);
}

/**
 * A function to alert the user using the browser's alert()
 * function.
 *
 * @param value the value to alert the user with
 */
function cadetAlert(value: any) {
  alert(value.toString());
}

/**
 * A dummy function to pass into createContext.
 * An actual implementation will have to be added
 * with the data visualizer implementation. See #187
 *
 * @param args the data to be visualized.
 */
function visualizeData(...args: Data[]) {
  try {
    // Pass in args[0] since args is in the form; [(Array of drawables), "playground"]
    DataVisualizer.drawData(args[0]);

    // If there is only one arg, just print out the first arg in REPL, instead of [first arg]
    return args[0].length === 1 ? args[0][0] : args[0];
  } catch (err) {
    console.log(err);
    throw new Error('Data visualizer is not enabled');
  }
}

export function visualizeEnv({ context }: { context: Context }) {
  try {
    EnvVisualizer.drawEnv(context);
  } catch (err) {
    throw new Error('Env visualizer is not enabled');
  }
}

export function highlightClean() {
  if ((window as any).Inspector) {
    (window as any).Inspector.highlightClean();
  } else {
    throw new Error('Inspector not loaded');
  }
}

export function highlightLine(line: number) {
  if ((window as any).Inspector) {
    (window as any).Inspector.highlightLine(line);
  } else {
    throw new Error('Inspector not loaded');
  }
}

export const externalBuiltIns = {
  display,
  rawDisplay,
  prompt: cadetPrompt,
  alert: cadetAlert,
  visualiseList: visualizeData
};

/**
 * A wrapper around calc-slang's createContext. This
 * provides the original function with the required
 * externalBuiltIns, such as display and prompt.
 */
export function createContext<T>(
  externals: string[],
  externalContext: T,
  variant: Variant = Variant.DEFAULT
) {
  return {}; // createSlangContext<T>(variant, externals, externalContext);
}


// Given a Context, returns a privileged Context that when referenced,
// intercepts reads from the underlying Context and returns desired values
export function makeElevatedContext(context: Context) {
  return context;
}

export function getDifferenceInMethods(elevatedContext: Context, context: Context) {
  return {}
}

export function getStoreExtraMethodsString(toRemove: string[], unblockKey: string) {
  return `const _____${unblockKey} = [${toRemove.join(', ')}];`;
}

export function getRestoreExtraMethodsString(removed: string[], unblockKey: string) {
  const store = `_____${unblockKey}`;
  return removed
    .map((x, key) => (x === 'makeUndefinedErrorFunction' ? '' : `const ${x} = ${store}[${key}];`))
    .join('\n');
}

export function getBlockExtraMethodsString(toRemove: string[]) {
  return toRemove
    .map(x =>
      x === 'makeUndefinedErrorFunction' ? '' : `const ${x} = makeUndefinedErrorFunction('${x}');`
    )
    .join('\n');
}
