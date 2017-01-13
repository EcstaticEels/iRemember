import React from 'react';
import { Nav, Navbar, NavItem, Button, Grid, Row, Col, NavDropdown, MenuItem } from 'react-bootstrap';
import { IndexLink } from 'react-router';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';

import {observer} from 'mobx-react';
import WebMobxStore from './webMobxStore';

var {caregiverName} = WebMobxStore;

@observer
class WebNav extends React.Component {
  constructor(props) {
    super(props);
  }

  onFilterClick(e) {
    this.props.handleStateChange(e);
  }

  render() {
    var loggedInMsg = !!this.props.caregiverName ? <NavItem>Logged in as: {this.props.caregiverName}</NavItem> : null;
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">Home</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav pullRight>
          {loggedInMsg}
          <NavItem href="/signin">Sign In</NavItem>
          <NavItem href="/signout">Sign Out</NavItem>
        </Nav>
      </Navbar>
    );
  }
}



module.exports = WebNav;