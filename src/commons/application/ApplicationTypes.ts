import { SourceError } from 'sml-slang/types';
import { Variant } from 'src/sml-integration';

import { PlaygroundState } from '../../features/playground/PlaygroundTypes';
import { PlaybackStatus, RecordingStatus } from '../../features/sourceRecorder/SourceRecorderTypes';
import { SideContentType } from '../sideContent/SideContentTypes';
import Constants from '../utils/Constants';
import { createContext } from '../utils/XSlangHelper';
import {
  DebuggerContext,
  WorkspaceLocation,
  WorkspaceManagerState,
  WorkspaceState
} from '../workspace/WorkspaceTypes';
import { SessionState } from './types/SessionTypes';

export type OverallState = {
  readonly application: ApplicationState;
  readonly playground: PlaygroundState;
  readonly session: SessionState;
  readonly workspaces: WorkspaceManagerState;
};

export type ApplicationState = {
  readonly title: string;
  readonly environment: ApplicationEnvironment;
};

/**
 * An output while the program is still being run in the interpreter. As a
 * result, there are no return values or SourceErrors yet. However, there could
 * have been calls to display (console.log) that need to be printed out.
 */
export type RunningOutput = {
  type: 'running';
  consoleLogs: string[];
};

/**
 * An output which reflects the program which the user had entered. Not a true
 * Output from the interpreter, but simply there to let he user know what had
 * been entered.
 */
export type CodeOutput = {
  type: 'code';
  value: string;
};

/**
 * An output which represents a program being run successfully, i.e. with a
 * return value at the end. A program can have either a return value, or errors,
 * but not both.
 */
export type ResultOutput = {
  type: 'result';
  value: any;
  consoleLogs: string[];
  runtime?: number;
  isProgram?: boolean;
};

/**
 * An output which represents a program being run unsuccessfully, i.e. with
 * errors at the end. A program can have either a return value, or errors, but
 * not both.
 */
export type ErrorOutput = {
  type: 'errors';
  errors: SourceError[];
  consoleLogs: string[];
};

export type InterpreterOutput = RunningOutput | CodeOutput | ResultOutput | ErrorOutput;

export enum ApplicationEnvironment {
  Development = 'development',
  Production = 'production',
  Test = 'test'
}

export enum Role {
  Student = 'student',
  Staff = 'staff',
  Admin = 'admin'
}

/**
 * Defines the Source sublanguages available for use.
 * For external libraries, see ExternalLibrariesTypes.ts
 */
export type SourceLanguage = {
  variant: Variant;
  displayName: string;
};

const variantDisplay: Map<Variant, string> = new Map([['sml-slang', 'SMLSlang']]);

export const styliseSublanguage = (variant: Variant = Constants.defaultSourceVariant) => {
  return `Source \xa7${variantDisplay.has(variant) ? ` ${variantDisplay.get(variant)}` : ''}`;
};

const sublanguages: { variant: Variant }[] = [{ variant: 'sml-slang' }];

export const sourceLanguages = sublanguages.map(sublang => {
  return {
    ...sublang,
    displayName: styliseSublanguage(sublang.variant)
  };
});

const currentEnvironment = (): ApplicationEnvironment => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return ApplicationEnvironment.Development;
    case 'production':
      return ApplicationEnvironment.Production;
    default:
      return ApplicationEnvironment.Test;
  }
};

export const defaultApplication: ApplicationState = {
  title: 'Cadet',
  environment: currentEnvironment()
};

export const defaultPlayground: PlaygroundState = {};

export const defaultEditorValue = `fun fib n =
  let
    fun loop acc i =
      if i > n then
        rev acc
      else
        case acc of
          [] => loop [0] (i + 1)
        | [0] => loop (1::acc) (i + 1)
        | snd::fst::_ => loop ((fst+snd)::acc) (i + 1)
  in
    loop [] 0
end

val () = (
  print (fib 0);
  print (fib 1);
  print (fib 2);
  print (fib 20)
)
`;

/**
 * Create a default IWorkspaceState for 'resetting' a workspace.
 * Takes in parameters to set the x-slang library.
 *
 * @param workspaceLocation the location of the workspace, used for context
 */
export const createDefaultWorkspace = (workspaceLocation: WorkspaceLocation): WorkspaceState => ({
  breakpoints: [],
  context: createContext<WorkspaceLocation>(
    [],
    workspaceLocation,
    Constants.defaultSourceVariant as Variant
  ),
  editorPrepend: '',
  editorSessionId: '',
  editorValue: workspaceLocation === 'playground' || 'sourcecast' ? defaultEditorValue : '',
  editorPostpend: '',
  editorReadonly: false,
  editorHeight: 150,
  editorWidth: '50%',
  execTime: 1000,
  highlightedLines: [],
  output: [],
  replHistory: {
    browseIndex: null,
    records: [],
    originalValue: ''
  },
  replValue: '',
  sharedbConnected: false,
  sideContentActiveTab: SideContentType.introduction,
  stepLimit: 1000,
  globals: [],
  isEditorAutorun: false,
  isRunning: false,
  isDebugging: false,
  enableDebugging: true,
  debuggerContext: {} as DebuggerContext
});

export const defaultRoomId = null;

export const defaultWorkspaceManager: WorkspaceManagerState = {
  playground: {
    ...createDefaultWorkspace('playground'),
    usingSubst: false
  },
  sourcecast: {
    ...createDefaultWorkspace('sourcecast'),
    audioUrl: '',
    codeDeltasToApply: null,
    currentPlayerTime: 0,
    description: null,
    inputToApply: null,
    playbackData: {
      init: {
        editorValue: '',
        variant: Constants.defaultSourceVariant
      },
      inputs: []
    },
    playbackDuration: 0,
    playbackStatus: PlaybackStatus.paused,
    sourcecastIndex: null,
    title: null,
    uid: null
  },
  sourcereel: {
    ...createDefaultWorkspace('sourcereel'),
    playbackData: {
      init: {
        editorValue: '',
        variant: Constants.defaultSourceVariant
      },
      inputs: []
    },
    recordingStatus: RecordingStatus.notStarted,
    timeElapsedBeforePause: 0,
    timeResumed: 0
  }
};

export const defaultSession: SessionState = {
  accessToken: undefined,
  group: null,
  historyHelper: {
    lastAcademyLocations: [null, null],
    lastGeneralLocations: [null, null]
  },
  refreshToken: undefined,
  role: undefined,
  name: undefined,
  notifications: []
};

export const defaultState: OverallState = {
  application: defaultApplication,
  playground: defaultPlayground,
  session: defaultSession,
  workspaces: defaultWorkspaceManager
};
