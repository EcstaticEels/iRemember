import React from 'react';
import { Nav, Navbar, NavItem, Button, Grid, Row, Col, NavDropdown, MenuItem } from 'react-bootstrap';
import { IndexLink } from 'react-router';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';

var WebNav = (props) => {
  var onFilterClick = (e) => {
    props.handleStateChange(e);
  };
  return (
    <Navbar>
      <Navbar.Header>
        <Navbar.Brand>
          <a href="/">Home</a>
        </Navbar.Brand>
      </Navbar.Header>
      <Nav pullRight>
        <NavItem href="/signin">Sign In</NavItem>
        <NavItem href="/signout">Sign Out</NavItem>
      </Nav>
    </Navbar>
  );
}



module.exports = WebNav;