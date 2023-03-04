import { Alignment, Classes, Icon, Navbar, NavbarGroup } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import classNames from 'classnames';
import * as React from 'react';

import { Role } from '../application/ApplicationTypes';

type NavigationBarProps = DispatchProps & StateProps;

type DispatchProps = {};

type StateProps = {
  role?: Role;
  title: string;
  name?: string;
};

const NavigationBar: React.SFC<NavigationBarProps> = props => (
  <Navbar className={classNames('NavigationBar', 'primary-navbar', Classes.DARK)}>
    <NavbarGroup align={Alignment.LEFT}>
      <div className={classNames('NavigationBar__link', Classes.BUTTON, Classes.MINIMAL)}>
        <Icon icon={IconNames.CODE} />
        <div className="navbar-button-text hidden-xs">{'SMLSlang Demonstration'}</div>
      </div>
    </NavbarGroup>
  </Navbar>
);

export default NavigationBar;
