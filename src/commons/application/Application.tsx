import moment from 'moment';
import * as React from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router';

// import Contributors from '../../pages/contributors/Contributors';

import NotFound from '../../pages/notFound/NotFound';
import Playground from '../../pages/playground/PlaygroundContainer';
import NavigationBar from '../navigationBar/NavigationBar';
import Constants from '../utils/Constants';
import { useLocalStorageState } from '../utils/Hooks';
import { defaultWorkspaceSettings, WorkspaceSettingsContext } from '../WorkspaceSettingsContext';
import { Role } from './ApplicationTypes';
import { UpdateCourseConfiguration, UserCourse } from './types/SessionTypes';

export type ApplicationProps = DispatchProps & StateProps & RouteComponentProps<{}>;

export type DispatchProps = {
  handleLogOut: () => void;
  handleGitHubLogIn: () => void;
  handleGitHubLogOut: () => void;
  fetchUserAndCourse: () => void;
  handleCreateCourse: (courseConfig: UpdateCourseConfiguration) => void;
  updateCourseResearchAgreement: (agreedToResearch: boolean) => void;
};

export type StateProps = {
  role?: Role;
  name?: string;
  courses: UserCourse[];
  courseId?: number;
  courseShortName?: string;
  enableAchievements?: boolean;
  enableSourcecast?: boolean;
  // assessmentConfigurations?: AssessmentConfiguration[];
  agreedToResearch?: boolean | null;
};

// const loginPath = <Route path="/login" component={Login} key="login" />;

const Application: React.FC<ApplicationProps> = props => {
  const intervalId = React.useRef<number | undefined>(undefined);
  const [isDisabled, setIsDisabled] = React.useState(computeDisabledState());
  const isMobile = /iPhone|iPad|Android/.test(navigator.userAgent);
  const isPWA = window.matchMedia('(display-mode: standalone)').matches; // Checks if user is accessing from the PWA
  const browserDimensions = React.useRef({ height: 0, width: 0 });

  const [workspaceSettings, setWorkspaceSettings] = useLocalStorageState(
    Constants.workspaceSettingsLocalStorageKey,
    defaultWorkspaceSettings
  );

  // const isLoggedIn = typeof props.name === 'string';
  // const isCourseLoaded = isLoggedIn && typeof props.role === 'string';

  // Effect to fetch the latest user info and course configurations from the backend on refresh,
  // if the user was previously logged in
  React.useEffect(() => {
    if (props.name) {
      props.fetchUserAndCourse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (Constants.disablePeriods.length > 0) {
      intervalId.current = window.setInterval(() => {
        const disabled = computeDisabledState();
        if (isDisabled !== disabled) {
          setIsDisabled(disabled);
        }
      }, 5000);
    }

    return () => {
      if (intervalId.current) {
        window.clearInterval(intervalId.current);
      }
    };
  }, [isDisabled]);

  /**
   * The following effect prevents the mobile browser interface from hiding on scroll by setting the
   * application height to the window's innerHeight, even after orientation changes. This ensures that
   * the app UI does not break due to the hiding of the browser interface when the user is not on the PWA.
   *
   * Note: When the soft keyboard is up on Android devices, the viewport height decreases and triggers
   * the 'resize' event. The conditional in orientationChangeHandler checks specifically for this, and
   * does not update the application height when the Android keyboard triggers the resize event. IOS
   * devices are not affected.
   */
  React.useEffect(() => {
    const orientationChangeHandler = () => {
      if (
        !(
          window.innerHeight < browserDimensions.current.height &&
          window.innerWidth === browserDimensions.current.width
        )
      ) {
        // If it is not an Android soft keyboard triggering the resize event, update the application height.
        document.documentElement.style.setProperty(
          '--application-height',
          window.innerHeight + 'px'
        );
      }
      browserDimensions.current = { height: window.innerHeight, width: window.innerWidth };
    };

    if (!isPWA && isMobile) {
      orientationChangeHandler();
      window.addEventListener('resize', orientationChangeHandler);
    }

    return () => {
      if (!isPWA && isMobile) {
        window.removeEventListener('resize', orientationChangeHandler);
      }
    };
  }, [isPWA, isMobile]);

  // Paths common to both deployments
  // const commonPaths = [
  //   <Route path="/contributors" component={Contributors} key="contributors" />,
  //   <Route path="/callback/github" component={GitHubCallback} key="githubCallback" />,
  //   Constants.enableGitHubAssessments ? (
  //     <Route
  //       path="/githubassessments"
  //       render={() => (
  //         <GitHubClassroom
  //           handleGitHubLogIn={props.handleGitHubLogIn}
  //           handleGitHubLogOut={props.handleGitHubLogOut}
  //         />
  //       )}
  //       key="githubAssessments"
  //     />
  //   ) : null
  // ];

  // const isDisabledEffective = !['staff', 'admin'].includes(props.role!) && isDisabled;

  return (
    <WorkspaceSettingsContext.Provider value={[workspaceSettings, setWorkspaceSettings]}>
      <div className="Application">
        <NavigationBar
          handleLogOut={props.handleLogOut}
          handleGitHubLogIn={props.handleGitHubLogIn}
          handleGitHubLogOut={props.handleGitHubLogOut}
          handleCreateCourse={props.handleCreateCourse}
          role={props.role}
          name={props.name}
          courses={props.courses}
          courseId={props.courseId}
          courseShortName={props.courseShortName}
          enableAchievements={props.enableAchievements}
          enableSourcecast={props.enableSourcecast}
          // assessmentTypes={React.useMemo(
          //   () => props.assessmentConfigurations?.map(c => c.type),
          //   [props.assessmentConfigurations]
          // )}
        />
        <div className="Application__main">
          <Switch>
            {/* {commonPaths} */}
            <Route path="/playground" component={Playground} />
            <Route exact={true} path="/">
              <Redirect to="/playground" />
            </Route>
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    </WorkspaceSettingsContext.Provider>
  );
};

// const redirectToLogin = () => <Redirect to="/login" />;
// const redirectToWelcome = () => <Redirect to="/welcome" />;

/**
 * A user routes to /academy,
 *  1. If the user is logged in, render the Academy component
 *  2. If the user is not logged in, redirect to /login
 */
// const toAcademy = ({ name, role }: ApplicationProps) =>
//   name === undefined ? redirectToLogin : role === undefined ? redirectToWelcome : () => <Academy />;

/**
 * Routes a user to the specified route,
 *  1. If the user is logged in, render the specified component
 *  2. If the user is not logged in, redirect to /login
 */
// const ensureUserAndRouteTo = ({ name }: ApplicationProps, to: JSX.Element) =>
//   name === undefined ? redirectToLogin : () => to;

/**
 * Routes a user to the specified route,
 *  1. If the user is logged in and has a latest viewed course, render the
 *     specified component
 *  2. If the user is not logged in, redirect to /login
 *  3. If the user is logged in, but does not have a course, redirect to /welcome
 */
// const ensureUserAndRoleAndRouteTo = ({ name, role }: ApplicationProps, to: JSX.Element) =>
//   name === undefined ? redirectToLogin : role === undefined ? redirectToWelcome : () => to;

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
