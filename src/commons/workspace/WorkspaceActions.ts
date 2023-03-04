import { Context } from 'sml-slang/types';
import { Variant } from 'src/sml-integration';
import { action } from 'typesafe-actions';

import { SET_EDITOR_READONLY } from '../../features/sourceRecorder/sourcecast/SourcecastTypes';
import { SourceLanguage } from '../application/ApplicationTypes';
import { HIGHLIGHT_LINE } from '../application/types/InterpreterTypes';
import { Position } from '../editor/EditorTypes';
import { NOTIFY_PROGRAM_EVALUATED, SideContentType } from '../sideContent/SideContentTypes';
import {
  BROWSE_REPL_HISTORY_DOWN,
  BROWSE_REPL_HISTORY_UP,
  CHANGE_EDITOR_HEIGHT,
  CHANGE_EDITOR_WIDTH,
  CHANGE_EXEC_TIME,
  CHANGE_SIDE_CONTENT_HEIGHT,
  CHANGE_STEP_LIMIT,
  CHANGE_SUBLANGUAGE,
  CLEAR_REPL_INPUT,
  CLEAR_REPL_OUTPUT,
  CLEAR_REPL_OUTPUT_LAST,
  EVAL_EDITOR,
  EVAL_REPL,
  FETCH_SUBLANGUAGE,
  MOVE_CURSOR,
  NAV_DECLARATION,
  PROMPT_AUTOCOMPLETE,
  SEND_REPL_INPUT_TO_OUTPUT,
  TOGGLE_EDITOR_AUTORUN,
  UPDATE_ACTIVE_TAB,
  UPDATE_EDITOR_BREAKPOINTS,
  UPDATE_EDITOR_VALUE,
  UPDATE_HAS_UNSAVED_CHANGES,
  UPDATE_REPL_VALUE,
  UPDATE_SUBLANGUAGE,
  UPDATE_WORKSPACE,
  VARIANT_SELECT,
  WorkspaceLocation,
  WorkspaceState
} from './WorkspaceTypes';

export const browseReplHistoryDown = (workspaceLocation: WorkspaceLocation) =>
  action(BROWSE_REPL_HISTORY_DOWN, { workspaceLocation });

export const browseReplHistoryUp = (workspaceLocation: WorkspaceLocation) =>
  action(BROWSE_REPL_HISTORY_UP, { workspaceLocation });

export const changeEditorHeight = (height: number, workspaceLocation: WorkspaceLocation) =>
  action(CHANGE_EDITOR_HEIGHT, { height, workspaceLocation });

export const changeEditorWidth = (widthChange: string, workspaceLocation: WorkspaceLocation) =>
  action(CHANGE_EDITOR_WIDTH, { widthChange, workspaceLocation });

export const changeExecTime = (execTime: string, workspaceLocation: WorkspaceLocation) =>
  action(CHANGE_EXEC_TIME, { execTime, workspaceLocation });

export const changeSideContentHeight = (height: number, workspaceLocation: WorkspaceLocation) =>
  action(CHANGE_SIDE_CONTENT_HEIGHT, { height, workspaceLocation });

export const changeStepLimit = (stepLimit: number, workspaceLocation: WorkspaceLocation) =>
  action(CHANGE_STEP_LIMIT, { stepLimit, workspaceLocation });

export const variantSelect = (variant: Variant, workspaceLocation: WorkspaceLocation) =>
  action(VARIANT_SELECT, {
    variant,
    workspaceLocation
  });

export const toggleEditorAutorun = (workspaceLocation: WorkspaceLocation) =>
  action(TOGGLE_EDITOR_AUTORUN, { workspaceLocation });

export const updateActiveTab = (activeTab: SideContentType, workspaceLocation: WorkspaceLocation) =>
  action(UPDATE_ACTIVE_TAB, { activeTab, workspaceLocation });

export const clearReplInput = (workspaceLocation: WorkspaceLocation) =>
  action(CLEAR_REPL_INPUT, { workspaceLocation });

export const clearReplOutput = (workspaceLocation: WorkspaceLocation) =>
  action(CLEAR_REPL_OUTPUT, { workspaceLocation });

export const clearReplOutputLast = (workspaceLocation: WorkspaceLocation) =>
  action(CLEAR_REPL_OUTPUT_LAST, { workspaceLocation });

/**
 * Finishes the process to clear the x-slang Context
 * at a specified workspace location.
 *
 * This action is to be handled in the reducer, to call the reset on the
 * Context in the state.
 *
 * @param library the Library that the context shall be using
 * @param workspaceLocation the location of the workspace
 *
 * @see Library in assessmentShape.ts
 */

export const evalEditor = (workspaceLocation: WorkspaceLocation) => {
  return action(EVAL_EDITOR, { workspaceLocation });
};

export const evalRepl = (workspaceLocation: WorkspaceLocation) =>
  action(EVAL_REPL, { workspaceLocation });

export const updateEditorValue = (newEditorValue: string, workspaceLocation: WorkspaceLocation) =>
  action(UPDATE_EDITOR_VALUE, { newEditorValue, workspaceLocation });

export const setEditorBreakpoint = (breakpoints: string[], workspaceLocation: WorkspaceLocation) =>
  action(UPDATE_EDITOR_BREAKPOINTS, { breakpoints, workspaceLocation });

export const highlightEditorLine = (
  highlightedLines: number[],
  workspaceLocation: WorkspaceLocation
) => action(HIGHLIGHT_LINE, { highlightedLines, workspaceLocation });

export const updateReplValue = (newReplValue: string, workspaceLocation: WorkspaceLocation) =>
  action(UPDATE_REPL_VALUE, { newReplValue, workspaceLocation });

export const sendReplInputToOutput = (newOutput: string, workspaceLocation: WorkspaceLocation) =>
  action(SEND_REPL_INPUT_TO_OUTPUT, {
    type: 'code',
    workspaceLocation,
    value: newOutput
  });

export const navigateToDeclaration = (
  workspaceLocation: WorkspaceLocation,
  cursorPosition: Position
) => action(NAV_DECLARATION, { workspaceLocation, cursorPosition });

export const moveCursor = (workspaceLocation: WorkspaceLocation, cursorPosition: Position) =>
  action(MOVE_CURSOR, { workspaceLocation, cursorPosition });

export const updateWorkspace = (
  workspaceLocation: WorkspaceLocation,
  workspaceOptions?: Partial<WorkspaceState>
) =>
  action(UPDATE_WORKSPACE, {
    workspaceLocation,
    workspaceOptions
  });

export const setEditorReadonly = (workspaceLocation: WorkspaceLocation, editorReadonly: boolean) =>
  action(SET_EDITOR_READONLY, {
    workspaceLocation,
    editorReadonly
  });

export const updateHasUnsavedChanges = (
  workspaceLocation: WorkspaceLocation,
  hasUnsavedChanges: boolean
) =>
  action(UPDATE_HAS_UNSAVED_CHANGES, {
    workspaceLocation,
    hasUnsavedChanges
  });

export const fetchSublanguage = () => action(FETCH_SUBLANGUAGE);

export const changeSublanguage = (sublang: SourceLanguage) =>
  action(CHANGE_SUBLANGUAGE, { sublang });

export const updateSublanguage = (sublang: SourceLanguage) =>
  action(UPDATE_SUBLANGUAGE, { sublang });

export const promptAutocomplete = (
  workspaceLocation: WorkspaceLocation,
  row: number,
  column: number,
  callback: any // TODO: define a type for this
) =>
  action(PROMPT_AUTOCOMPLETE, {
    workspaceLocation,
    row,
    column,
    callback
  });

export const notifyProgramEvaluated = (
  result: any,
  lastDebuggerResult: any,
  code: string,
  context: Context,
  workspaceLocation?: WorkspaceLocation
) =>
  action(NOTIFY_PROGRAM_EVALUATED, {
    result,
    lastDebuggerResult,
    code,
    context,
    workspaceLocation
  });
