import React from 'react';
import Moment from 'moment';

var ReminderEntry = (props) => {
  
  var changeCurrent = () => {
    props.updateCurrent(props.data);
  }

  var mapIcons = (type) => {
    if (type === 'medication') {
      return '/pill_logo1.jpg';
    } else if (type === 'appointment') {
      return '/appointment_logo3.jpg';
    } else {
      return '/reminder_logo.jpg';
    }
  }

  return (
    <div className="reminder-entry" onClick={changeCurrent}>
      <img src={mapIcons(props.data.type)} height="100" width="100"/>
      <div>{Moment(props.data.date).calendar().toString()}</div>
      <div>{props.data.note}</div>
    </div>
  )
};

module.exports = ReminderEntry;