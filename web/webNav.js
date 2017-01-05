import React from 'react';
import { Nav, Navbar, NavItem, Button, Grid, Row, Col, NavDropdown, MenuItem } from 'react-bootstrap';
import { IndexLink } from 'react-router';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';

var WebNav = (props) => {
  var onFilterClick = (e) => {
    props.handleStateChange(e)
  }
  return (
    <Navbar>
      <Navbar.Header>
        <Navbar.Brand>
          <a href="/">Home</a>
        </Navbar.Brand>
      </Navbar.Header>
      <Nav pullRight>
        <NavItem href="#">Sign In</NavItem>
      </Nav>
    </Navbar>
  );
}

/*<Nav activeKey='allTime' bsStyle='pills' onSelect={onFilterClick}>
      <NavDropdown eventKey='mostClicked' title='Popular' id='nav-dropdown'>
        <MenuItem eventKey='today' title='menuItem' onClick={props.sortByToday}>Today</MenuItem>
        <MenuItem eventKey='thisWeek' title='menuItem' onClick={props.sortByWeek}>This Week</MenuItem>
        <MenuItem eventKey='thisMonth' title='menuItem' onClick={props.sortByMonth}>This Month</MenuItem>
        <MenuItem eventKey='allTime' title='menuItem' onClick={props.sortByCopyCount}>All-Time</MenuItem>
      </NavDropdown>
      <NavItem title='all' eventKey='all'>All</NavItem>
      <NavItem title='blue' eventKey='blue'>Blue</NavItem>
      <NavItem title='red' eventKey='red'>Red</NavItem>
      <NavItem title='green' eventKey='green'>Green</NavItem>
      </Nav>*/




module.exports = WebNav;