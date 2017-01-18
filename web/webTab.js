import React from 'react';
import {Link} from 'react-router';
import {Nav, Navbar, NavItem, NavDropdown, MenuItem, Button} from 'react-bootstrap';
import {LinkContainer, IndexLinkContainer} from 'react-router-bootstrap';

var Tab = (props) => {

  var changeTab = (select) => {
    props.changeView(select)
  }

  return (

    <Nav bsStyle="tabs" className="tabNav container">
      <LinkContainer to="/reminders" className="link">
        <NavItem>Reminders</NavItem>
      </LinkContainer>
      <LinkContainer to="/face" className="link">
        <NavItem>Face</NavItem>
      </LinkContainer>
    </Nav>
  )
}

module.exports = Tab;