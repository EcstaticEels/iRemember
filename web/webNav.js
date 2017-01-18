import React from 'react';
import { Nav, Navbar, NavItem, Button, Grid, Row, Col, NavDropdown, MenuItem } from 'react-bootstrap';
import { IndexLink } from 'react-router';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';

import {observer} from 'mobx-react';
import {caregiverName, needsSetup} from './webMobxStore';

@observer
class WebNav extends React.Component {
  constructor(props) {
    super(props);
  }

  onFilterClick(e) {
    this.props.handleStateChange(e);
  }

  render() {
    var loggedInMsg = !!caregiverName.get() ? <NavItem>Logged in as: {caregiverName.get()}</NavItem> : null;
    var signInBtn = !caregiverName.get() ?  <NavItem href="/signin">Sign In</NavItem> : null;
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">iRemember</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav pullRight>
          {loggedInMsg}
          {signInBtn}
          <NavItem href="/signout">Sign Out</NavItem>
        </Nav>
      </Navbar>
    );
  }
}



module.exports = WebNav;