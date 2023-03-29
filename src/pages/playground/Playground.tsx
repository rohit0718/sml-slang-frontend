import { Classes } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import classNames from 'classnames';
import { isEqual } from 'lodash';
import { decompressFromEncodedURIComponent } from 'lz-string';
import * as React from 'react';
import { HotKeys } from 'react-hotkeys';
import { RouteComponentProps } from 'react-router';
import { SideContentTab, SideContentType } from 'src/commons/sideContent/SideContentTypes';
import Constants from 'src/commons/utils/Constants';
import { stringParamToInt } from 'src/commons/utils/ParamParseHelper';
import { parseQuery } from 'src/commons/utils/QueryHelper';
import { initSession, log } from 'src/features/eventLogging';
import { Variant } from 'src/sml-integration';

import {
  InterpreterOutput,
  /* OverallState, */
  sourceLanguages
} from '../../commons/application/ApplicationTypes';
import { ControlBarAutorunButtons } from '../../commons/controlBar/ControlBarAutorunButtons';
import { ControlBarClearButton } from '../../commons/controlBar/ControlBarClearButton';
import { ControlBarEvalButton } from '../../commons/controlBar/ControlBarEvalButton';
// import { ControlBarStepLimit } from '../../commons/controlBar/ControlBarStepLimit';
import { ControlBarVariantSelect } from '../../commons/controlBar/ControlBarVariantSelect';
import { HighlightedLines, Position } from '../../commons/editor/EditorTypes';
import Markdown from '../../commons/Markdown';
import { generateSourceIntroduction } from '../../commons/utils/IntroductionHelper';
import Workspace, { WorkspaceProps } from '../../commons/workspace/Workspace';
import {
  CodeDelta,
  Input,
  SelectionRange
} from '../../features/sourceRecorder/SourceRecorderTypes';

export type PlaygroundProps = DispatchProps & StateProps & RouteComponentProps<{}>;

export type DispatchProps = {
  handleActiveTabChange: (activeTab: SideContentType) => void;
  handleBrowseHistoryDown: () => void;
  handleBrowseHistoryUp: () => void;
  handleChangeExecTime: (execTime: number) => void;
  handleChangeStepLimit: (stepLimit: number) => void;
  handleVariantSelect: (variant: Variant) => void;
  handleDeclarationNavigate: (cursorPosition: Position) => void;
  handleEditorEval: () => void;
  handleEditorHeightChange: (height: number) => void;
  handleEditorValueChange: (val: string) => void;
  handleEditorWidthChange: (widthChange: number) => void;
  handleEditorUpdateBreakpoints: (breakpoints: string[]) => void;
  handleFetchSublanguage: () => void;
  handleGenerateLz: () => void;
  handleShortenURL: (s: string) => void;
  handleUpdateShortURL: (s: string) => void;
  handleInterruptEval: () => void;
  handleReplEval: () => void;
  handleReplOutputClear: () => void;
  handleReplValueChange: (newValue: string) => void;
  handleSendReplInputToOutput: (code: string) => void;
  handleSetEditorSessionId: (editorSessionId: string) => void;
  handleSetSharedbConnected: (connected: boolean) => void;
  handleSideContentHeightChange: (heightChange: number) => void;
  handleDebuggerPause: () => void;
  handleDebuggerResume: () => void;
  handleDebuggerReset: () => void;
  handleToggleEditorAutorun: () => void;
  handleFetchVariant: () => void;
  handlePromptAutocomplete: (row: number, col: number, callback: any) => void;
};

export type StateProps = {
  editorSessionId: string;
  editorValue: string;
  editorHeight?: number;
  editorWidth: string;
  execTime: number;
  breakpoints: string[];
  highlightedLines: HighlightedLines[];
  isEditorAutorun: boolean;
  isRunning: boolean;
  isDebugging: boolean;
  enableDebugging: boolean;
  newCursorPosition?: Position;
  output: InterpreterOutput[];
  queryString?: string;
  sideContentHeight?: number;
  shortURL?: string;
  replValue: string;
  sourceVariant: Variant;
  stepLimit: number;
  persistenceUser: string | undefined;
};

const keyMap = { goGreen: 'h u l k' };

function handleHash(hash: string, props: PlaygroundProps) {
  const qs = parseQuery(hash);

  const programLz = qs.lz ?? qs.prgrm;
  const program = programLz && decompressFromEncodedURIComponent(programLz);
  if (program) {
    props.handleEditorValueChange(program);
  }

  const variant: Variant =
    sourceLanguages.find(language => language.variant === qs.variant)?.variant ??
    Constants.defaultSourceVariant;
  props.handleVariantSelect(variant);

  const execTime = Math.max(stringParamToInt(qs.exec || '1000') || 1000, 1000);
  if (execTime) {
    props.handleChangeExecTime(execTime);
  }
}

const Playground: React.FC<PlaygroundProps> = props => {
  const propsRef = React.useRef(props);
  propsRef.current = props;
  const setLastEdit = React.useState(new Date())[1];
  const [isGreen, setIsGreen] = React.useState(false);
  const [selectedTab, setSelectedTab] = React.useState(SideContentType.introduction);
  const setHasBreakpoints = React.useState(false)[1];
  const [sessionId, setSessionId] = React.useState(() =>
    initSession('playground', {
      editorValue: propsRef.current.editorValue
    })
  );

  React.useEffect(() => {
    // Only fetch default Playground sublanguage when not loaded via a share link
    if (!propsRef.current.location.hash) {
      propsRef.current.handleFetchSublanguage();
    }
  }, []);

  React.useEffect(() => {
    // When the editor session Id changes, then treat it as a new session.
    setSessionId(
      initSession('playground', {
        editorValue: propsRef.current.editorValue
      })
    );
  }, [props.editorSessionId]);

  const hash = props.location.hash;
  React.useEffect(() => {
    if (!hash) {
      return;
    }
    handleHash(hash, propsRef.current);
  }, [hash]);

  const handlers = React.useMemo(
    () => ({
      goGreen: () => setIsGreen(!isGreen)
    }),
    [isGreen]
  );

  const onEditorValueChange = React.useCallback(
    val => {
      setLastEdit(new Date());
      propsRef.current.handleEditorValueChange(val);
    },
    [setLastEdit]
  );

  const onChangeTabs = React.useCallback(
    (
      newTabId: SideContentType,
      prevTabId: SideContentType,
      event: React.MouseEvent<HTMLElement>
    ) => {
      if (newTabId === prevTabId) {
        return;
      }
      setSelectedTab(newTabId);
    },
    []
  );

  const pushLog = React.useCallback(
    (newInput: Input) => {
      log(sessionId, newInput);
    },
    [sessionId]
  );

  const autorunButtons = React.useMemo(
    () => (
      <ControlBarAutorunButtons
        handleDebuggerPause={props.handleDebuggerPause}
        handleDebuggerReset={props.handleDebuggerReset}
        handleDebuggerResume={props.handleDebuggerResume}
        handleEditorEval={props.handleEditorEval}
        handleInterruptEval={props.handleInterruptEval}
        handleToggleEditorAutorun={props.handleToggleEditorAutorun}
        isDebugging={props.isDebugging}
        isEditorAutorun={props.isEditorAutorun}
        isRunning={props.isRunning}
        key="autorun"
      />
    ),
    [
      props.handleDebuggerPause,
      props.handleDebuggerReset,
      props.handleDebuggerResume,
      props.handleEditorEval,
      props.handleInterruptEval,
      props.handleToggleEditorAutorun,
      props.isDebugging,
      props.isEditorAutorun,
      props.isRunning
    ]
  );

  const variantSelectHandler = React.useCallback(
    ({ variant }: { variant: Variant }, _: any) => {
      const { handleReplOutputClear, handleVariantSelect } = propsRef.current;
      handleReplOutputClear();

      const input: Input = {
        time: Date.now(),
        type: 'variantSelect',
        data: variant
      };

      pushLog(input);

      handleVariantSelect(variant);
    },
    [pushLog]
  );

  const variantSelect = React.useMemo(
    () => (
      <ControlBarVariantSelect
        handleVariantSelect={variantSelectHandler}
        sourceVariant={props.sourceVariant}
        key="variant"
      />
    ),
    [variantSelectHandler, props.sourceVariant]
  );

  const clearButton = React.useMemo(
    () => (
      <ControlBarClearButton handleReplOutputClear={props.handleReplOutputClear} key="clear_repl" />
    ),
    [props.handleReplOutputClear]
  );

  const evalButton = React.useMemo(
    () => (
      <ControlBarEvalButton
        handleReplEval={props.handleReplEval}
        isRunning={props.isRunning}
        key="eval_repl"
      />
    ),
    [props.handleReplEval, props.isRunning]
  );

  /* const executionTime = React.useMemo(
   *   () => (
   *     <ControlBarExecutionTime
   *       execTime={props.execTime}
   *       handleChangeExecTime={props.handleChangeExecTime}
   *       key="execution_time"
   *     />
   *   ),
   *   [props.execTime, props.handleChangeExecTime]
   * ); */

  // const stepperStepLimit = React.useMemo(
  //   () => (
  //     <ControlBarStepLimit
  //       stepLimit={props.stepLimit}
  //       handleChangeStepLimit={props.handleChangeStepLimit}
  //       key="step_limit"
  //     />
  //   ),
  //   [props.handleChangeStepLimit, props.stepLimit]
  // );

  const { handleEditorValueChange } = props;

  const playgroundIntroductionTab: SideContentTab = React.useMemo(
    () => ({
      label: 'Introduction',
      iconName: IconNames.COMPASS,
      body: <Markdown content={generateSourceIntroduction()} openLinksInNewWindow={true} />,
      id: SideContentType.introduction,
      toSpawn: () => true
    }),
    []
  );

  const tabs = React.useMemo(() => {
    const tabs: SideContentTab[] = [playgroundIntroductionTab];
    return tabs;
  }, [playgroundIntroductionTab]);

  const onChangeMethod = React.useCallback(
    (newCode: string, delta: CodeDelta) => {
      handleEditorValueChange(newCode);

      const input: Input = {
        time: Date.now(),
        type: 'codeDelta',
        data: delta
      };

      pushLog(input);
    },
    [handleEditorValueChange, pushLog]
  );

  const onCursorChangeMethod = React.useCallback(
    (selection: any) => {
      const input: Input = {
        time: Date.now(),
        type: 'cursorPositionChange',
        data: selection.getCursor()
      };

      pushLog(input);
    },
    [pushLog]
  );

  const onSelectionChangeMethod = React.useCallback(
    (selection: any) => {
      const range: SelectionRange = selection.getRange();
      const isBackwards: boolean = selection.isBackwards();
      if (!isEqual(range.start, range.end)) {
        const input: Input = {
          time: Date.now(),
          type: 'selectionRangeData',
          data: { range, isBackwards }
        };

        pushLog(input);
      }
    },
    [pushLog]
  );

  const handleEditorUpdateBreakpoints = React.useCallback(
    (breakpoints: string[]) => {
      // get rid of holes in array
      const numberOfBreakpoints = breakpoints.filter(arrayItem => !!arrayItem).length;
      if (numberOfBreakpoints > 0) {
        setHasBreakpoints(true);
      }
      if (numberOfBreakpoints === 0) {
        setHasBreakpoints(false);
      }
      propsRef.current.handleEditorUpdateBreakpoints(breakpoints);
    },
    [setHasBreakpoints]
  );

  const replDisabled = false;

  const workspaceProps: WorkspaceProps = {
    controlBarProps: {
      editorButtons: [autorunButtons, variantSelect],
      replButtons: [replDisabled ? null : evalButton, clearButton]
    },
    editorProps: {
      onChange: onChangeMethod,
      onCursorChange: onCursorChangeMethod,
      onSelectionChange: onSelectionChangeMethod,
      sourceVariant: props.sourceVariant,
      editorValue: props.editorValue,
      editorSessionId: props.editorSessionId,
      handleDeclarationNavigate: props.handleDeclarationNavigate,
      handleEditorEval: props.handleEditorEval,
      handleEditorValueChange: onEditorValueChange,
      handleSendReplInputToOutput: props.handleSendReplInputToOutput,
      handlePromptAutocomplete: props.handlePromptAutocomplete,
      isEditorAutorun: props.isEditorAutorun,
      breakpoints: props.breakpoints,
      highlightedLines: props.highlightedLines,
      newCursorPosition: props.newCursorPosition,
      handleEditorUpdateBreakpoints: handleEditorUpdateBreakpoints,
      handleSetSharedbConnected: props.handleSetSharedbConnected
    },
    editorHeight: props.editorHeight,
    editorWidth: props.editorWidth,
    handleEditorHeightChange: props.handleEditorHeightChange,
    handleEditorWidthChange: props.handleEditorWidthChange,
    handleSideContentHeightChange: props.handleSideContentHeightChange,
    replProps: {
      sourceVariant: props.sourceVariant,
      output: props.output,
      replValue: props.replValue,
      handleBrowseHistoryDown: props.handleBrowseHistoryDown,
      handleBrowseHistoryUp: props.handleBrowseHistoryUp,
      handleReplEval: props.handleReplEval,
      handleReplValueChange: props.handleReplValueChange,
      hidden: false,
      inputHidden: replDisabled
    },
    sideContentHeight: props.sideContentHeight,
    sideContentProps: {
      defaultSelectedTabId: selectedTab,
      handleActiveTabChange: props.handleActiveTabChange,
      onChange: onChangeTabs,
      tabs,
      workspaceLocation: 'playground'
    },
    sideContentIsResizeable: true
  };

  return (
    <HotKeys
      className={classNames('Playground', Classes.DARK, isGreen ? 'GreenScreen' : undefined)}
      keyMap={keyMap}
      handlers={handlers}
    >
      <Workspace {...workspaceProps} />
    </HotKeys>
  );
};

export default Playground;
