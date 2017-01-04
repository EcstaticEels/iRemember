import React from 'react';
import Moment from 'moment';


var ReminderCurrent = (props) => {
  var edit = () => {
    props.edit(props.current);
  }

  return (
    <div className="reminder-current">
      <img src={props.current.img} height="200" width="200"/>
      <div>{Moment(props.current.date).calendar().toString()}</div>
      <div>{props.current.note}</div>
      <button onClick={edit}>Edit</button>
    </div>
  )
};

module.exports = ReminderCurrent;
