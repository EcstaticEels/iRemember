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

  render() {
    return (
      <div className="reminder-form">
        <h4>New Reminder</h4>
        <form>
          <label>
            Time:
            <DateField
              forceValidDate
              dateFormat={"MM/DD/YYYY HH:mm"}
              defaultValue={Moment()}
              className= 'date'
            > 
              <Calendar style={{padding: 10}} weekNumbers={false} defaultDate={Moment()}
                onChange={(dateString, { dateMoment, timestamp}) => {
                  // console.log(dateString, dateMoment, timestamp)
                  console.log('converted: ', Moment.utc(dateMoment).format(), 'unconverted: ', dateMoment.format());
                  this.props.handleDateChange(Moment.utc(dateMoment).format());
                }}
                />
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
           <div>{
            this.props.recurring? 
            <label className="recurringDays">
              Select Days:
              <input type="checkbox" id="Monday" value="Monday" checked={this.props.selectedDays.Monday} onClick={this.props.getSelectedDay}/><label for="Monday">Monday</label>
              <input type="checkbox" id="Tuesday" value="Tuesday" checked={this.props.selectedDays.Tuesday} onClick={this.props.getSelectedDay}/><label for="Tuesday">Tuesday</label>
              <input type="checkbox" id="Wednesday" value="Wednesday" checked={this.props.selectedDays.Wednesday} onClick={this.props.getSelectedDay}/><label for="Wednesday">Wednesday</label>
              <input type="checkbox" id="Thursday" value="Thursday" checked={this.props.selectedDays.Thursday} onClick={this.props.getSelectedDay}/><label for="Thursday">Thursday</label>
              <input type="checkbox" id="Friday" value="Friday" checked={this.props.selectedDays.Friday} onClick={this.props.getSelectedDay}/><label for="Friday">Friday</label>
              <input type="checkbox" id="Saturday" value="Saturday" checked={this.props.selectedDays.Saturday} onClick={this.props.getSelectedDay}/><label for="Saturday">Saturday</label>
              <input type="checkbox" id="Sunday" value="Sunday" checked={this.props.selectedDays.Sunday} onClick={this.props.getSelectedDay}/><label for="Sunday">Sunday</label>
            </label> : null
          }</div>
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