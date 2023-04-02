import { SagaIterator } from 'redux-saga';
import { call, put, race, select } from 'redux-saga/effects';
import { Context } from 'sml-slang/types';
import Constants from 'src/commons/utils/Constants';
import { run, Variant } from 'src/sml-integration';

import { OverallState } from '../application/ApplicationTypes';
import { DEBUG_RESET, DEBUG_RESUME, HIGHLIGHT_LINE } from '../application/types/InterpreterTypes';
import { Documentation } from '../documentation/Documentation';
import { actions } from '../utils/ActionsHelper';
import { showWarningMessage } from '../utils/NotificationsHelper';
import { highlightLine, inspectorUpdate, visualiseEnv } from '../utils/XSlangHelper';
import { notifyProgramEvaluated } from '../workspace/WorkspaceActions';
import {
  EVAL_EDITOR,
  EVAL_REPL,
  EVAL_SILENT,
  NAV_DECLARATION,
  PROMPT_AUTOCOMPLETE,
  TOGGLE_EDITOR_AUTORUN,
  UPDATE_EDITOR_BREAKPOINTS,
  VARIANT_SELECT,
  WorkspaceLocation
} from '../workspace/WorkspaceTypes';
import { safeTakeEvery as takeEvery } from './SafeEffects';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function* WorkspaceSaga(): SagaIterator {
  let context: Context;

  yield takeEvery(EVAL_EDITOR, function* (action: ReturnType<typeof actions.evalEditor>) {
    const workspaceLocation = action.payload.workspaceLocation;
    const [editorCode, execTime]: [string, number] = yield select((state: OverallState) => [
      state.workspaces[workspaceLocation].editorValue!,
      state.workspaces[workspaceLocation].execTime
    ]);
    // End any code that is running right now.
    yield put(actions.beginInterruptExecution(workspaceLocation));
    // Clear the context, with the same externalSymbols as before.
    // yield put(actions.beginClearContext(workspaceLocation, false));
    yield put(actions.clearReplOutput(workspaceLocation));
    context = yield select((state: OverallState) => state.workspaces[workspaceLocation].context);
    const value = editorCode;
    // Check for initial syntax errors. If there are errors, we continue with
    // eval and let it print the error messages.
    yield call(evalCode, value, context, execTime, workspaceLocation, EVAL_EDITOR);
  });

  yield takeEvery(PROMPT_AUTOCOMPLETE, function* (
    action: ReturnType<typeof actions.promptAutocomplete>
  ) {
    const workspaceLocation = action.payload.workspaceLocation;

    context = yield select((state: OverallState) => state.workspaces[workspaceLocation].context);
    // const code: string = yield select((state: OverallState) => {
    //   const prependCode = state.workspaces[workspaceLocation].editorPrepend;
    //   const editorCode = state.workspaces[workspaceLocation].editorValue!;
    //   return [prependCode, editorCode] as [string, string];
    // });
    // const [prepend, editorValue] = code;

    // TODO: use autocompleteCode and prependLength to identify names in code
    // Deal with prepended code
    // let autocompleteCode;
    // let prependLength = 0;
    // if (!prepend) {
    //   autocompleteCode = editorValue;
    // } else {
    //   prependLength = prepend.split('\n').length;
    //   autocompleteCode = prepend + '\n' + editorValue;
    // }

    // TODO: Check if user is declaring a name
    const displaySuggestions = true;

    if (!displaySuggestions) {
      yield call(action.payload.callback);
      return;
    }

    const builtinSuggestions = Documentation.builtins['default'] || [];
    const keywordSuggestions = Documentation.keywords['default'] || [];
    const typeSuggestions = Documentation.types['default'] || [];

    yield call(action.payload.callback, null, [
      ...builtinSuggestions,
      ...keywordSuggestions,
      ...typeSuggestions
    ]);
  });

  yield takeEvery(TOGGLE_EDITOR_AUTORUN, function* (
    action: ReturnType<typeof actions.toggleEditorAutorun>
  ) {
    const workspaceLocation = action.payload.workspaceLocation;
    const isEditorAutorun: boolean = yield select(
      (state: OverallState): boolean => state.workspaces[workspaceLocation].isEditorAutorun
    );
    yield call(showWarningMessage, 'Autorun ' + (isEditorAutorun ? 'Started' : 'Stopped'), 750);
  });

  yield takeEvery(EVAL_REPL, function* (action: ReturnType<typeof actions.evalRepl>) {
    const workspaceLocation = action.payload.workspaceLocation;
    const code: string = yield select(
      (state: OverallState) => state.workspaces[workspaceLocation].replValue
    );
    const execTime: number = yield select(
      (state: OverallState) => state.workspaces[workspaceLocation].execTime
    );
    yield put(actions.beginInterruptExecution(workspaceLocation));
    yield put(actions.clearReplInput(workspaceLocation));
    yield put(actions.sendReplInputToOutput(code, workspaceLocation));
    context = yield select((state: OverallState) => state.workspaces[workspaceLocation].context);
    yield call(evalCode, code, context, execTime, workspaceLocation, EVAL_REPL);
  });

  yield takeEvery(DEBUG_RESUME, function* (action: ReturnType<typeof actions.debuggerResume>) {
    const workspaceLocation = action.payload.workspaceLocation;
    const code: string = yield select(
      (state: OverallState) => state.workspaces[workspaceLocation].editorValue
    );
    const execTime: number = yield select(
      (state: OverallState) => state.workspaces[workspaceLocation].execTime
    );
    yield put(actions.beginInterruptExecution(workspaceLocation));
    /** Clear the context, with the same chapter and externalSymbols as before. */
    yield put(actions.clearReplOutput(workspaceLocation));
    context = yield select((state: OverallState) => state.workspaces[workspaceLocation].context);
    yield put(actions.highlightEditorLine([], workspaceLocation));
    yield call(evalCode, code, context, execTime, workspaceLocation, DEBUG_RESUME);
  });

  yield takeEvery(DEBUG_RESET, function* (action: ReturnType<typeof actions.debuggerReset>) {
    const workspaceLocation = action.payload.workspaceLocation;
    context = yield select((state: OverallState) => state.workspaces[workspaceLocation].context);
    yield put(actions.clearReplOutput(workspaceLocation));
    inspectorUpdate(undefined);
    highlightLine(undefined);
    yield put(actions.clearReplOutput(workspaceLocation));
    lastDebuggerResult = undefined;
  });

  yield takeEvery(HIGHLIGHT_LINE, function* (
    action: ReturnType<typeof actions.highlightEditorLine>
  ) {
    const workspaceLocation = action.payload.highlightedLines;
    highlightLine(workspaceLocation[0]);
    yield;
  });

  yield takeEvery(UPDATE_EDITOR_BREAKPOINTS, function* (
    action: ReturnType<typeof actions.setEditorBreakpoint>
  ) {
    // breakpoints = action.payload.breakpoints;
    yield;
  });

  yield takeEvery(VARIANT_SELECT, function* (action: ReturnType<typeof actions.variantSelect>) {});

  yield takeEvery(NAV_DECLARATION, function* (
    action: ReturnType<typeof actions.navigateToDeclaration>
  ) {
    const workspaceLocation = action.payload.workspaceLocation;
    context = yield select((state: OverallState) => state.workspaces[workspaceLocation].context);

    /*
    const result = findDeclaration(code, context, {
      line: action.payload.cursorPosition.row + 1,
      column: action.payload.cursorPosition.column
    });

    if (result) {
      yield put(
        actions.moveCursor(action.payload.workspaceLocation, {
          row: result.start.line - 1,
          column: result.start.column
        })
      );
    }
    */
  });
}

let lastDebuggerResult: any;
function* updateInspector(workspaceLocation: WorkspaceLocation): SagaIterator {
  try {
    const start = lastDebuggerResult.context.runtime.nodes[0].loc.start.line - 1;
    const end = lastDebuggerResult.context.runtime.nodes[0].loc.end.line - 1;
    yield put(actions.highlightEditorLine([start, end], workspaceLocation));
    inspectorUpdate(lastDebuggerResult);
    visualiseEnv(lastDebuggerResult);
  } catch (e) {
    yield put(actions.highlightEditorLine([], workspaceLocation));
    // most likely harmless, we can pretty much ignore this.
    // half of the time this comes from execution ending or a stack overflow and
    // the context goes missing.
  }
}

export function* evalCode(
  code: string,
  context: Context,
  execTime: number,
  workspaceLocation: WorkspaceLocation,
  actionType: string
): SagaIterator {
  // const substActiveAndCorrectChapter = workspaceLocation === 'playground';
  // if (substActiveAndCorrectVariant) {
  //   context.executionMethod = 'interpreter';
  // }

  function call_variant(variant: Variant) {
    if (variant === Constants.defaultSourceVariant) {
      return call(run, code, context);
    } else {
      throw new Error('Unknown variant: ' + variant);
    }
  }

  const { result } = yield race({
    result: call_variant(Constants.defaultSourceVariant)
  });

  if (actionType === EVAL_EDITOR) {
    lastDebuggerResult = result;
  }
  yield call(updateInspector, workspaceLocation);

  if (
    result.status !== 'suspended' &&
    result.status !== 'finished' &&
    result.status !== 'suspended-non-det'
  ) {
    yield put(actions.evalInterpreterError([result.error], workspaceLocation));
    return;
  } else if (result.status === 'suspended') {
    yield put(actions.endDebuggerPause(workspaceLocation));
    yield put(actions.evalInterpreterSuccess('Breakpoint hit!', workspaceLocation));
    return;
  }

  // Do not write interpreter output to REPL, if executing chunks (e.g. prepend/postpend blocks)
  if (actionType !== EVAL_SILENT) {
    yield put(actions.evalInterpreterSuccess(result, workspaceLocation));
  }

  // For EVAL_EDITOR and EVAL_REPL, we send notification to workspace that a program has been evaluated
  if (actionType === EVAL_EDITOR || actionType === EVAL_REPL) {
    yield put(notifyProgramEvaluated(result, lastDebuggerResult, code, context, workspaceLocation));
  }
}
