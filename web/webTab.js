import React from 'react';
import {Link} from 'react-router';
import {Nav, Navbar, NavItem, NavDropdown, MenuItem, Button} from 'react-bootstrap';
import {LinkContainer, IndexLinkContainer} from 'react-router-bootstrap';

var Tab = (props) => {

  var changeTab = (select) => {
    props.changeView(select)
  }

  return (
    <Nav bsStyle="tabs" className="tabNav">
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
    // <Navbar fixedTop inverse>
    //   <Nav activeKey='allTime' bsStyle='pills' onSelect={changeTab}>
    //     <NavItem title='reminders'  eventKey='reminders'><Link to="/reminders">Reminders</Link></NavItem>
    //     <NavItem title='face'  eventKey='face'><Link to="/face">Face Recognition</Link></NavItem>
    //   </Nav>
    // </Navbar>