import { Card, Classes, Pre } from '@blueprintjs/core';
import classNames from 'classnames';
import * as React from 'react';
import { HotKeys } from 'react-hotkeys';
import { formatFinishedForRepl } from 'sml-slang/utils/formatters';
import { parseError, Variant } from 'src/sml-integration';

import { InterpreterOutput, ResultOutput } from '../application/ApplicationTypes';
import SideContentCanvasOutput from '../sideContent/SideContentCanvasOutput';
import ReplInput from './ReplInput';
import { OutputProps } from './ReplTypes';

export type ReplProps = DispatchProps & StateProps;

type StateProps = {
  output: InterpreterOutput[];
  replValue: string;
  hidden?: boolean;
  inputHidden?: boolean;
  usingSubst?: boolean;
  sourceVariant: Variant;
};

type DispatchProps = {
  handleBrowseHistoryDown: () => void;
  handleBrowseHistoryUp: () => void;
  handleReplEval: () => void;
  handleReplValueChange: (newCode: string) => void;
};

class Repl extends React.PureComponent<ReplProps, {}> {
  public constructor(props: ReplProps) {
    super(props);
  }

  public render() {
    const cards = this.props.output.map((slice, index) => <Output output={slice} key={index} />);
    return (
      <div className="Repl" style={{ display: this.props.hidden ? 'none' : undefined }}>
        <div className="repl-output-parent">
          {cards}
          {!this.props.inputHidden && (
            <HotKeys
              className={classNames('repl-input-parent', 'row', Classes.CARD, Classes.ELEVATION_0)}
              handlers={handlers}
            >
              <ReplInput {...this.props} />
            </HotKeys>
          )}
        </div>
      </div>
    );
  }
}

export const Output: React.FC<OutputProps> = (props: OutputProps) => {
  switch (props.output.type) {
    case 'code':
      return (
        <Card>
          <Pre className="codeOutput">{props.output.value}</Pre>
        </Card>
      );
    case 'running':
      return (
        <Card>
          <Pre className="logOutput">{props.output.consoleLogs.join('\n')}</Pre>
        </Card>
      );
    case 'result':
      console.dir(props.output, { depth: 4 });
      if (props.output.consoleLogs.length === 0) {
        return <Card>{renderResult(props.output)}</Card>;
      } else {
        return (
          <Card>
            <Pre className="logOutput">{props.output.consoleLogs.join('\n')}</Pre>
            {renderResult(props.output)}
          </Card>
        );
      }
    case 'errors':
      if (props.output.consoleLogs.length === 0) {
        return (
          <Card>
            <Pre className="errorOutput">{parseError(props.output.errors)}</Pre>
          </Card>
        );
      } else {
        return (
          <Card>
            <Pre className="logOutput">{props.output.consoleLogs.join('\n')}</Pre>
            <br />
            <Pre className="errorOutput">{parseError(props.output.errors)}</Pre>
          </Card>
        );
      }
    default:
      return <Card>''</Card>;
  }
};

const renderResult = (output: ResultOutput) => {
  /** A class which is the output of the show() function */
  const ShapeDrawn = (window as any).ShapeDrawn;
  if (typeof ShapeDrawn !== 'undefined' && output.value instanceof ShapeDrawn) {
    return (
      <Pre className="resultOutput">
        <SideContentCanvasOutput canvas={output.value.$canvas} />
      </Pre>
    );
  }

  return <Pre className="resultOutput">{formatFinishedForRepl(output.value)}</Pre>;
};

/* Override handler, so does not trigger when focus is in editor */
const handlers = {
  goGreen: () => {}
};

export default Repl;
