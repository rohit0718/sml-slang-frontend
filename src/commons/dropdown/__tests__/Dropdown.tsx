import { shallow } from 'enzyme';
import * as React from 'react';

import Dropdown from '../Dropdown';

test('Dropdown does not mount Profile component when a user is not logged in', () => {
  const props = {
    handleLogOut: () => {},
    isAboutOpen: false,
    isHelpOpen: false,
    isProfileOpen: false
  };
  const app = <Dropdown {...props} />;
  const tree = shallow(app);
  expect(tree.debug()).toMatchSnapshot();
});

test('Dropdown correctly mounts Profile component when a user is logged in', () => {
  const props = {
    handleLogOut: () => {},
    isAboutOpen: false,
    isHelpOpen: false,
    isProfileOpen: false,
    name: 'Some user'
  };
  const app = <Dropdown {...props} />;
  const tree = shallow(app);
  expect(tree.debug()).toMatchSnapshot();
});
