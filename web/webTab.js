import React from 'react';
import {Link} from 'react-router';
import {Nav, Navbar, NavItem, NavDropdown, MenuItem, Button} from 'react-bootstrap';
import {LinkContainer, IndexLinkContainer} from 'react-router-bootstrap';
import {observer} from 'mobx-react';
import {caregiverName, needsSetup} from './webMobxStore';

@observer
class Tab extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var nav = !!caregiverName.get() && !needsSetup.get() ? 
      (<Nav bsStyle="tabs" className="tabNav">
        <LinkContainer to="/reminders" className="link">
          <NavItem>Reminders</NavItem>
        </LinkContainer>
        <LinkContainer to="/face" className="link">
          <NavItem>Face</NavItem>
        </LinkContainer>
        <LinkContainer to="/setup" className="link">
          <NavItem>Setup</NavItem>
        </LinkContainer>
      </Nav>) : null;

    return nav;
  }
}


module.exports = Tab;