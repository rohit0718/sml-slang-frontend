import { Chapter, Language, Variant } from '../../sml-slang-config'
import { SourceError } from 'sml-slang/src/errors/types'

import { PlaygroundState } from '../../features/playground/PlaygroundTypes';
import { PlaybackStatus, RecordingStatus } from '../../features/sourceRecorder/SourceRecorderTypes';
import Constants from '../utils/Constants';
import { createContext } from '../utils/JsSlangHelper';
import {
  DebuggerContext,
  WorkspaceLocation,
  WorkspaceManagerState,
  WorkspaceState
} from '../workspace/WorkspaceTypes';
import { ExternalLibraryName } from './types/ExternalTypes';
import { SessionState } from './types/SessionTypes';

export type OverallState = {
  readonly application: ApplicationState;
  readonly playground: PlaygroundState;
  readonly session: SessionState;
  readonly workspaces: WorkspaceManagerState;
};

export type ApplicationState = {
  readonly environment: ApplicationEnvironment;
};

export type Story = {
  story: string;
  playStory: boolean;
};

export type GameState = {
  collectibles: { [id: string]: string };
  completed_quests: string[];
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
 * Defines the languages available for use on Source Academy,
 * including Source sublanguages and other languages e.g. full JS.
 * For external libraries, see ExternalLibrariesTypes.ts
 */
export interface SALanguage extends Language {
  displayName: string;
}

const variantDisplay: Map<Variant, string> = new Map([
  [Variant.DEFAULT, 'SML-Slang']
]);


export const styliseSublanguage = (chapter: Chapter, variant: Variant = Variant.DEFAULT) => {
  return `Source \xa7${chapter}${
    variantDisplay.has(variant) ? ` ${variantDisplay.get(variant)}` : ''
  }`;
};

export const sublanguages: Language[] = [
  { chapter: Chapter.SMLSlang, variant: Variant.DEFAULT }
];

export const sourceLanguages: SALanguage[] = sublanguages.map(sublang => {
  return {
    ...sublang,
    displayName: styliseSublanguage(sublang.chapter, sublang.variant)
  };
});

export const defaultLanguages = sourceLanguages.filter(
  sublang => sublang.variant === Variant.DEFAULT
);

export const variantLanguages = sourceLanguages.filter(
  sublang => sublang.variant !== Variant.DEFAULT
);

export const isSourceLanguage = (chapter: Chapter) =>
  [Chapter.SMLSlang].includes(chapter);

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
  environment: currentEnvironment()
};

export const defaultPlayground: PlaygroundState = {
  githubSaveInfo: { repoName: '', filePath: '' }
};

export const defaultEditorValue = '1+1';

/**
 * Create a default IWorkspaceState for 'resetting' a workspace.
 * Takes in parameters to set the sml-slang library and chapter.
 *
 * @param workspaceLocation the location of the workspace, used for context
 */
export const createDefaultWorkspace = (workspaceLocation: WorkspaceLocation): WorkspaceState => ({
  autogradingResults: [],
  context: createContext<WorkspaceLocation>(
    [],
    workspaceLocation,
    Constants.defaultSourceVariant
  ),
  activeEditorTabIndex: 0,
  editorTabs: [
    {
      value: ['playground', 'sourcecast', 'githubAssessments'].includes(workspaceLocation)
        ? defaultEditorValue
        : '',
      prependValue: '',
      postpendValue: '',
      highlightedLines: [],
      breakpoints: []
    }
  ],
  editorSessionId: '',
  isEditorReadonly: false,
  editorTestcases: [],
  externalLibrary: ExternalLibraryName.NONE,
  execTime: 1000,
  output: [],
  replHistory: {
    browseIndex: null,
    records: [],
    originalValue: ''
  },
  replValue: '',
  sharedbConnected: false,
  stepLimit: 1000,
  globals: [],
  isEditorAutorun: false,
  isRunning: false,
  isDebugging: false,
  enableDebugging: true,
  debuggerContext: {} as DebuggerContext
});

export const defaultWorkspaceManager: WorkspaceManagerState = {
  assessment: {
    ...createDefaultWorkspace('assessment'),
    currentAssessment: undefined,
    currentQuestion: undefined,
    hasUnsavedChanges: false
  },
  grading: {
    ...createDefaultWorkspace('grading'),
    currentSubmission: undefined,
    currentQuestion: undefined,
    hasUnsavedChanges: false
  },
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
        chapter: Chapter.SMLSlang,
        externalLibrary: ExternalLibraryName.NONE
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
        chapter: Chapter.SMLSlang,
        externalLibrary: ExternalLibraryName.NONE
      },
      inputs: []
    },
    recordingStatus: RecordingStatus.notStarted,
    timeElapsedBeforePause: 0,
    timeResumed: 0
  },
  sicp: {
    ...createDefaultWorkspace('sicp'),
    usingSubst: false
  },
  githubAssessment: {
    ...createDefaultWorkspace('githubAssessment'),
    hasUnsavedChanges: false
  }
};

export const defaultSession: SessionState = {
  group: null,
  notifications: []
};

export const defaultState: OverallState = {
  application: defaultApplication,
  playground: defaultPlayground,
  session: defaultSession,
  workspaces: defaultWorkspaceManager
};
