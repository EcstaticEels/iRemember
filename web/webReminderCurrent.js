import React from 'react';
import Moment from 'moment';
import {Button, Row, Col} from 'react-bootstrap';
import ReactAudioPlayer from 'react-audio-player';
import { observer } from 'mobx-react';
import {caregiverName, needsSetup, patientName} from './webMobxStore';

@observer
export default class ReminderCurrent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var audioView = this.props.current.audio ? <ReactAudioPlayer src={this.props.current.audio} /> : <h5>No audio submitted yet for this face</h5>;
    var recurringView = !!this.props.current.recurring ? 
      (<div className="reminder-recurring">
        <h3 className='reminder-current-header'>Recurring Days:</h3>
        <h5>{this.props.current.recurringDays.split(',').join(', ')}</h5>
      </div>) : null;
    var reminderCurrentView;
    if (!!this.props.current.title) {
      reminderCurrentView = (
        <div className="reminder-current">
          <h1 className="face-current-name">{this.props.current.title}
            <i className="edit fa fa-pencil-square-o" onClick={this.props.edit} aria-hidden="true"></i>
            <i className="trash fa fa-trash-o" onClick={this.props.delete} aria-hidden="true"></i>
          </h1>
            <div className="reminder-type">
              <h3 className='reminder-current-header'>Type:</h3>
              <h5>{this.props.current.type}</h5>
            </div>
            <div className="reminder-time">
              <h3 className='reminder-current-header'>Time:</h3>
              <h5>{Moment(this.props.current.date).calendar(null, {sameElse: 'MM/DD/YYYY hh:mm a'}).toString()}</h5>
            </div>
            {recurringView}
            <div className="reminder-description">
              <h3 className='reminder-current-header'>Description:</h3>
              <h5>{this.props.current.note}</h5>
            </div>
            <div className="reminder-audio">
              <h3 className='reminder-current-header'>Audio Reminder:</h3>
              {audioView}
            </div>
        </div>
      )
    } else {
      reminderCurrentView = (
        <div className="face-current">
          <h2 className="no-reminder-current">Add a reminder for {patientName.get()}</h2>
        </div>
      )
    }

    return reminderCurrentView;
  }
}

