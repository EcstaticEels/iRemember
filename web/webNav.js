import React from 'react';
import { Nav, Navbar, NavItem, Button, Grid, Row, Col, NavDropdown, MenuItem } from 'react-bootstrap';
import { IndexLink } from 'react-router';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';
import Auth from './webAuth.js';

var WebNav = (props) => {
  var onFilterClick = (e) => {
    props.handleStateChange(e);
  };

  var loggedInMsg = Auth.loggedIn() ? <NavItem>Logged in as: {props.name}</NavItem> : null;
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



module.exports = WebNav;