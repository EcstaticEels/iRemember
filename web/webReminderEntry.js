import React from 'react';

var ReminderEntry = (props) => {
  
  var changeCurrent = () => {
    props.updateCurrent(props.data);
  }

  return (
    <div className="reminder-entry" onClick={changeCurrent}>
      <img src={props.data.img} height="100" width="100"/>
      <div>{props.data.time}</div>
      <div>{props.data.note}</div>
    </div>
  )
};

module.exports = ReminderEntry;