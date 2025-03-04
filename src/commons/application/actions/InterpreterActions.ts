import { SourceError } from 'sml-slang/types';
import { action } from 'typesafe-actions';

import { WorkspaceLocation } from '../../workspace/WorkspaceTypes';
import {
  BEGIN_DEBUG_PAUSE,
  BEGIN_INTERRUPT_EXECUTION,
  DEBUG_RESET,
  DEBUG_RESUME,
  END_DEBUG_PAUSE,
  END_INTERRUPT_EXECUTION,
  EVAL_INTERPRETER_ERROR,
  EVAL_INTERPRETER_SUCCESS,
  HANDLE_CONSOLE_LOG
} from '../types/InterpreterTypes';

export const handleConsoleLog = (logString: string, workspaceLocation: WorkspaceLocation) =>
  action(HANDLE_CONSOLE_LOG, { logString, workspaceLocation });

export const evalInterpreterSuccess = (value: any, workspaceLocation: WorkspaceLocation) =>
  action(EVAL_INTERPRETER_SUCCESS, { type: 'result', value, workspaceLocation });

export const evalInterpreterError = (errors: SourceError[], workspaceLocation: WorkspaceLocation) =>
  action(EVAL_INTERPRETER_ERROR, { type: 'errors', errors, workspaceLocation });

export const beginInterruptExecution = (workspaceLocation: WorkspaceLocation) =>
  action(BEGIN_INTERRUPT_EXECUTION, { workspaceLocation });

export const endInterruptExecution = (workspaceLocation: WorkspaceLocation) =>
  action(END_INTERRUPT_EXECUTION, { workspaceLocation });

export const beginDebuggerPause = (workspaceLocation: WorkspaceLocation) =>
  action(BEGIN_DEBUG_PAUSE, { workspaceLocation });

export const endDebuggerPause = (workspaceLocation: WorkspaceLocation) =>
  action(END_DEBUG_PAUSE, { workspaceLocation });

export const debuggerResume = (workspaceLocation: WorkspaceLocation) =>
  action(DEBUG_RESUME, { workspaceLocation });

export const debuggerReset = (workspaceLocation: WorkspaceLocation) =>
  action(DEBUG_RESET, { workspaceLocation });
