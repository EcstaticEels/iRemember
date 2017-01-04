import React from 'react';
import Moment from 'moment';

var ReminderEntry = (props) => {
  
  var changeCurrent = () => {
    props.updateCurrent(props.data);
  }

  return (
    <div className="reminder-entry" onClick={changeCurrent}>
      <img src={props.data.img} height="100" width="100"/>
      <div>{Moment(props.data.date).calendar().toString()}</div>
      <div>{props.data.note}</div>
    </div>
  )
};

module.exports = ReminderEntry;