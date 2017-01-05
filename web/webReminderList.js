import React from 'react';
import ReminderEntry from './webReminderEntry.js';
import {ListGroup, ListGroupItem} from 'react-bootstrap';

var ReminderList = (props) => (
  <div className="reminder-list">
    <ListGroup fill>
      {props.list.map((val, ind) => <ListGroupItem key={ind}><ReminderEntry data={val} updateCurrent={props.updateCurrent}/></ListGroupItem>)}
    </ListGroup>
  </div>
);

module.exports = ReminderList;