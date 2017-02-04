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
    var nav = !!caregiverName.get() ? (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">iRemember</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav pullRight>
          <NavItem className="caregiver-name">Logged in as: {caregiverName.get()}</NavItem>
          <NavItem href="/signout">Sign Out</NavItem>
        </Nav>
      </Navbar>) : null;
    return nav;
  }
}



module.exports = WebNav;