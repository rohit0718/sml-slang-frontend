import moment from 'moment';
import * as React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router';

import Disabled from '../../pages/disabled/Disabled';
import NotFound from '../../pages/notFound/NotFound';
import Playground from '../../pages/playground/PlaygroundContainer';
import SourcecastContainer from '../../pages/sourcecast/SourcecastContainer';
import NavigationBar from '../navigationBar/NavigationBar';
import Constants from '../utils/Constants';
import { Role } from './ApplicationTypes';

export type ApplicationProps = DispatchProps & StateProps & RouteComponentProps<{}>;

export type DispatchProps = {};

export type StateProps = {
  role?: Role;
  title: string;
  name?: string;
};

interface ApplicationState {
  disabled: string | boolean;
}

class Application extends React.Component<ApplicationProps, ApplicationState> {
  private intervalId: number | undefined;

  public constructor(props: ApplicationProps) {
    super(props);
    this.state = { disabled: computeDisabledState() };
  }

  public componentDidMount() {
    if (Constants.disablePeriods.length > 0) {
      this.intervalId = window.setInterval(() => {
        const disabled = computeDisabledState();
        if (this.state.disabled !== disabled) {
          this.setState({ disabled });
        }
      }, 5000);
    }
  }

  public componentWillUnmount() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }
  }

  public render() {
    const disabled = !['staff', 'admin'].includes(this.props.role!) && this.state.disabled;

    return (
      <div className="Application">
        <NavigationBar role={this.props.role} name={this.props.name} title={this.props.title} />
        <div className="Application__main">
          {disabled && (
            <Switch>
              <Route render={this.renderDisabled.bind(this)} />
            </Switch>
          )}
          {!disabled && (
            <Switch>
              <Route path="/" component={Playground} />
              <Route path="/sourcecast/:sourcecastId?" component={SourcecastContainer} />
              <Route component={NotFound} />
            </Switch>
          )}
        </div>
      </div>
    );
  }

  private renderDisabled = () => (
    <Disabled reason={typeof this.state.disabled === 'string' ? this.state.disabled : undefined} />
  );
}

function computeDisabledState() {
  const now = moment();
  for (const { start, end, reason } of Constants.disablePeriods) {
    if (start.isBefore(now) && end.isAfter(now)) {
      return reason || true;
    }
  }
  return false;
}

export default Application;
