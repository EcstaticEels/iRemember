import React from 'react';
import Moment from 'moment';
import {Button} from 'react-bootstrap';


var ReminderCurrent = (props) => {
  return (
    <div className="reminder-current">
      <h1>Current Reminder</h1>
      <img src={props.current.img} height="200" width="200"/>
      <div><h3>Time:</h3>{Moment(props.current.date).calendar().toString()}</div>
      <div><h3>Description:</h3>{props.current.note}</div>
      <br/>
      <audio src={props.current.audio} controls></audio>
      <br/>
      <Button bsSize='small' className="btn-edit" onClick={props.edit}>Edit</Button>
      <Button onClick={props.delete}>Delete</Button>
    </div>
  )
};

module.exports = ReminderCurrent;
