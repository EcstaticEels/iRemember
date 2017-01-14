import React from 'react';
import Moment from 'moment';
import {Button} from 'react-bootstrap';
import ReactAudioPlayer from 'react-audio-player';
import { observer } from 'mobx-react';
import {caregiverName, needsSetup, patientName} from './webMobxStore';

@observer
export default class ReminderCurrent extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    var audio = this.props.current.audio || null;
    var reminderCurrentView;
    if (this.props.current.title) {
      reminderCurrentView = (
        <div className="reminder-current">
          <h1>{this.props.current.title}</h1>
          <img src={this.props.current.img} height="200" width="200"/>
          <div><h3>Time:</h3>{Moment(this.props.current.date).calendar(null, {sameElse: 'MM/DD/YYYY hh:mm a'}).toString()}</div>
          <div><h3>RecurringDays:</h3>{this.props.current.recurringDays}</div>
          <div><h3>Description:</h3>{this.props.current.note}</div>
          <br/>
          <label><h3>Audio Reminder:</h3>
            <ReactAudioPlayer src={this.props.current.audio} />
          </label>
          <br/>
          <Button bsSize='small' className="btn-edit" onClick={this.props.edit}>Edit</Button>
          <Button bsSize='small' className="btn-delete" onClick={this.props.delete}>Delete</Button>
        </div>
      )
    } else {
      reminderCurrentView = (
        <div className="face-current">
          <h1>Add a reminder for {patientName.get()}</h1>
        </div>
      )
    }

    return reminderCurrentView;
  }
}

