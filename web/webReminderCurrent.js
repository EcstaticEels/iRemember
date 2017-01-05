import React from 'react';
import Moment from 'moment';
import {Button} from 'react-bootstrap';


var ReminderCurrent = (props) => {
  var edit = () => {
    props.edit(props.current);
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
    <div className="reminder-current">
      <h1>Current Reminder</h1>
      <img src={mapIcons(props.current.type)} height="200" width="200"/>
      <div><h3>Time:</h3>{Moment(props.current.date).calendar().toString()}</div>
      <div><h3>Description:</h3>{props.current.note}</div>
      <Button bsSize='small' className="btn-edit" onClick={edit}>Edit</Button>
    </div>
  )
};

module.exports = ReminderCurrent;
