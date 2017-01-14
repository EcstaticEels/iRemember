import React from 'react';
import {Button, Row, Col, Grid} from 'react-bootstrap';
import AudioUpload from './webAudioUpload.js';
import Moment from 'moment';
import { TransitionView, Calendar, DateField, DatePicker } from 'react-date-picker';

export default class ReminderList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: Moment()
    }
  }

              // <Calendar
              //   dateFormat="DD/MM/YYYY HH:mm:ss"
              //   weekNumbers={false}
              //   defaultDate="20/04/2016 16:23:56"
              //   onChange={(dateString, { dateMoment, timestamp}) => {}}
              // />
  render() {
                // <input className="date" type="datetime-local" value={this.props.date} onChange={this.props.getInput}/>

    return (
      <div className="reminder-form">
        <h4>New Reminder</h4>
        <form>
          <label>
            Time:
            <DateField
              forceValidDate
              dateFormat={"MM/DD/YYYY HH:mm:ss"}
              defaultValue={Moment()}
              className= 'date'
            > 
              <Calendar style={{padding: 10}} weekNumbers={false} defaultDate={Moment()}
      onChange={(dateString, { dateMoment, timestamp}) => {
        console.log('converted: ', Moment.utc(dateMoment).format(), 'unconverted: ', dateMoment.format());
        this.props.handleDateChange(Moment.utc(dateMoment).format());
      }}/>
            </DateField>
          </label>
          <br/>
          <label>
            Type:
            <select className="type" value={this.props.type} onChange={this.props.getInput} required>
              <option value='medication'>Medication</option>
              <option value='appointment'>Appointment</option>
              <option value='chores'>Chores</option>
              <option value='others'>Others</option>
            </select>
          </label>
          <br/>
          <label>
            Recurring:
            <label>
              <input 
                name="recurring"
                className="recurring"
                type="radio"
                value={false}
                onChange={this.props.getBoolean}
                checked={this.props.recurring? false: true}/>
              Once
            </label>
            <label>
              <input 
                name="recurring"
                className="recurring"
                type="radio"
                value={true}
                onChange={this.props.getBoolean}
                checked={this.props.recurring? true: false}/>
              Recurring
            </label>
          </label>
          <br/>
          <label>Current Uploaded Audio Reminder:
            <br />
            <audio src={this.props.audio} controls></audio>
          </label>
          <br />
          <label>Upload Audio Message:
            <AudioUpload getAudio={this.props.getAudio} />
          </label>
          <br />
          <label>Title:
            <input type="text" value={this.props.title} className="title" placeholder="Title" onChange={this.props.getInput} />
          </label>
          <br />
          <label>Notes:
            <input type="text" value={this.props.note} className="note" placeholder="Notes" onChange={this.props.getInput}/>
          </label>
          <br />
          <input type="submit" value="Submit" onClick={this.props.submitForm}/>
        </form>
      </div>
    );
  }
}


