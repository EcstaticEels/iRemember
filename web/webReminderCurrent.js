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
    var audio = this.props.current.audio || null;
    var reminderCurrentView;
    if (this.props.current.title) {
      reminderCurrentView = (
        <div className="reminder-current">
          <h1 className="reminder-current-heading">{this.props.current.title}</h1>
          <Row className="show-grid">
            <div>
              <img src={this.props.current.img} height="200" width="200"/>
            </div>
          </Row>
          <Row className="show-grid">
            <div>
              <h3>Time:</h3>
              <h5>{Moment(this.props.current.date).calendar(null, {sameElse: 'MM/DD/YYYY hh:mm a'}).toString()}</h5>
            </div>
          </Row>
          <Row className="show-grid">
            <div>
              <h3>Recurring Days:</h3>
              <h5>{this.props.current.recurringDays}</h5>
            </div>
          </Row>
          <Row className="show-grid">
            <div>
              <h3>Description:</h3>
              <h5>{this.props.current.note}</h5>
            </div>
          </Row>
          <Row className="show-grid">
            <div>
              <h3>Audio Reminder:</h3>
              <ReactAudioPlayer src={this.props.current.audio} />
            </div>
          </Row>
          <Row className="show-grid">
            <Button bsSize='small' className="btn-edit" onClick={this.props.edit}>Edit</Button>
            <Button bsSize='small' className="btn-delete" onClick={this.props.delete}>Delete</Button>
          </Row>
        </div>

      )
    } else {
      reminderCurrentView = (
        <div className="face-current">
          <h2>Add a reminder for {patientName.get()}</h2>
        </div>
      )
    }

    return reminderCurrentView;
  }
}

