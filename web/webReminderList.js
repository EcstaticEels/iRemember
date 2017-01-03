import React from 'react';
import ReminderEntry from './webReminderEntry.js';

var ReminderList = (props) => (
  <div className="reminder-list">{
    props.list.map((val, ind) => <ReminderEntry data={val} key={ind} updateCurrent={props.updateCurrent}/>)
  }</div>
);

module.exports = ReminderList;