import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';
import Constants from 'src/commons/utils/Constants';
import { Variant } from 'src/sml-integration';

import {
  beginDebuggerPause,
  beginInterruptExecution,
  debuggerReset,
  debuggerResume
} from '../../commons/application/actions/InterpreterActions';
import { OverallState } from '../../commons/application/ApplicationTypes';
import { Position } from '../../commons/editor/EditorTypes';
import { SideContentType } from '../../commons/sideContent/SideContentTypes';
import {
  browseReplHistoryDown,
  browseReplHistoryUp,
  changeEditorHeight,
  changeEditorWidth,
  changeSideContentHeight,
  clearReplOutput,
  evalEditor,
  evalRepl,
  navigateToDeclaration,
  promptAutocomplete,
  setEditorBreakpoint,
  setEditorReadonly,
  toggleEditorAutorun,
  updateActiveTab,
  updateEditorValue,
  updateReplValue,
  variantSelect
} from '../../commons/workspace/WorkspaceActions';
import { WorkspaceLocation } from '../../commons/workspace/WorkspaceTypes';
import { fetchSourcecastIndex } from '../../features/sourceRecorder/sourcecast/SourcecastActions';
import {
  setCodeDeltasToApply,
  setCurrentPlayerTime,
  setInputToApply,
  setSourcecastData,
  setSourcecastDuration,
  setSourcecastStatus
} from '../../features/sourceRecorder/SourceRecorderActions';
import {
  CodeDelta,
  Input,
  PlaybackData,
  PlaybackStatus
} from '../../features/sourceRecorder/SourceRecorderTypes';
import Sourcecast, { DispatchProps, StateProps } from './Sourcecast';

const mapStateToProps: MapStateToProps<StateProps, {}, OverallState> = state => ({
  audioUrl: state.workspaces.sourcecast.audioUrl,
  currentPlayerTime: state.workspaces.sourcecast.currentPlayerTime,
  codeDeltasToApply: state.workspaces.sourcecast.codeDeltasToApply,
  title: state.workspaces.sourcecast.title,
  description: state.workspaces.sourcecast.description,
  editorReadonly: state.workspaces.sourcecast.editorReadonly,
  editorWidth: state.workspaces.sourcecast.editorWidth,
  editorValue: state.workspaces.sourcecast.editorValue!,
  isEditorAutorun: state.workspaces.sourcecast.isEditorAutorun,
  inputToApply: state.workspaces.sourcecast.inputToApply,
  breakpoints: state.workspaces.sourcecast.breakpoints,
  highlightedLines: state.workspaces.sourcecast.highlightedLines,
  isRunning: state.workspaces.sourcecast.isRunning,
  isDebugging: state.workspaces.sourcecast.isDebugging,
  enableDebugging: state.workspaces.sourcecast.enableDebugging,
  newCursorPosition: state.workspaces.sourcecast.newCursorPosition,
  output: state.workspaces.sourcecast.output,
  playbackDuration: state.workspaces.sourcecast.playbackDuration,
  playbackData: state.workspaces.sourcecast.playbackData,
  playbackStatus: state.workspaces.sourcecast.playbackStatus,
  replValue: state.workspaces.sourcecast.replValue,
  sideContentActiveTab: state.workspaces.sourcecast.sideContentActiveTab,
  sideContentHeight: state.workspaces.sourcecast.sideContentHeight,
  sourcecastIndex: state.workspaces.sourcecast.sourcecastIndex,
  sourceVariant: Constants.defaultSourceVariant,
  uid: state.workspaces.sourcecast.uid
});

const location: WorkspaceLocation = 'sourcecast';

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      handleActiveTabChange: (activeTab: SideContentType) => updateActiveTab(activeTab, location),
      handleBrowseHistoryDown: () => browseReplHistoryDown(location),
      handleBrowseHistoryUp: () => browseReplHistoryUp(location),
      handleVariantSelect: (variant: Variant) => variantSelect(variant, location),
      handleDeclarationNavigate: (cursorPosition: Position) =>
        navigateToDeclaration(location, cursorPosition),
      handleEditorEval: () => evalEditor(location),
      handleEditorValueChange: (val: string) => updateEditorValue(val, location),
      handleEditorHeightChange: (height: number) => changeEditorHeight(height, location),
      handleEditorWidthChange: (widthChange: number) =>
        changeEditorWidth(widthChange.toString(), location),
      handleEditorUpdateBreakpoints: (breakpoints: string[]) =>
        setEditorBreakpoint(breakpoints, location),
      handleFetchSourcecastIndex: () => fetchSourcecastIndex(location),
      handleInterruptEval: () => beginInterruptExecution(location),
      handleReplEval: () => evalRepl(location),
      handleReplOutputClear: () => clearReplOutput(location),
      handleReplValueChange: (newValue: string) => updateReplValue(newValue, location),
      handleSetCurrentPlayerTime: (playerTime: number) =>
        setCurrentPlayerTime(playerTime, location),
      handleSetCodeDeltasToApply: (deltas: CodeDelta[]) => setCodeDeltasToApply(deltas, location),
      handleSetEditorReadonly: (editorReadonly: boolean) =>
        setEditorReadonly(location, editorReadonly),
      handleSetInputToApply: (inputToApply: Input) => setInputToApply(inputToApply, location),
      handleSetSourcecastData: (
        title: string,
        description: string,
        uid: string,
        audioUrl: string,
        playbackData: PlaybackData
      ) => setSourcecastData(title, description, uid, audioUrl, playbackData, location),
      handleSetSourcecastDuration: (duration: number) => setSourcecastDuration(duration, location),
      handleSetSourcecastStatus: (playbackStatus: PlaybackStatus) =>
        setSourcecastStatus(playbackStatus, location),
      handleSideContentHeightChange: (heightChange: number) =>
        changeSideContentHeight(heightChange, location),
      handleToggleEditorAutorun: () => toggleEditorAutorun(location),
      handleDebuggerPause: () => beginDebuggerPause(location),
      handleDebuggerResume: () => debuggerResume(location),
      handleDebuggerReset: () => debuggerReset(location),
      handlePromptAutocomplete: (row: number, col: number, callback: any) =>
        promptAutocomplete(location, row, col, callback)
    },
    dispatch
  );

const SourcecastContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(Sourcecast));

export default SourcecastContainer;
