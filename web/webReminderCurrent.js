import React from 'react';
import Moment from 'moment';
import {Button} from 'react-bootstrap';
import ReactAudioPlayer from 'react-audio-player';

var ReminderCurrent = (props) => {
  var audio = props.current.audio || null;
  console.log('audio', audio);
  return (
    <div className="reminder-current">
      <h1>{props.current.title}</h1>
      <img src={props.current.img} height="200" width="200"/>
      <div><h3>Time:</h3>{Moment(props.current.date).calendar().toString()}</div>
      <div><h3>Description:</h3>{props.current.note}</div>
      <br/>
      <label><h3>Audio Reminder:</h3>
        <ReactAudioPlayer src={props.current.audio} />
      </label>
      <br/>
      <Button bsSize='small' className="btn-edit" onClick={props.edit}>Edit</Button>
      <Button bsSize='small' className="btn-delete" onClick={props.delete}>Delete</Button>
    </div>
  );
};

module.exports = ReminderCurrent;

