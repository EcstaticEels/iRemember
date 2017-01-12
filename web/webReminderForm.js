import React from 'react';
import {Button, Row, Col, Grid} from 'react-bootstrap';
import AudioUpload from './webAudioUpload.js';

var ReminderList = (props) => (
  <div className="reminder-form">
    <h4>New Reminder</h4>
    <form>
      <label>
        Time:
        <input className="date" type="datetime-local" value={props.date} onChange={props.getInput}/>
      </label>
      <br/>
      <label>
        Type:
        <select className="type" value={props.type} onChange={props.getInput} required>
          <option value='medication'>Medication</option>
          <option value='appointment'>Appointment</option>
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
            onChange={props.getBoolean}
            checked={props.recurring? false: true}/>
          Once
        </label>
        <label>
          <input 
            name="recurring"
            className="recurring"
            type="radio"
            value={true}
            onChange={props.getBoolean}
            checked={props.recurring? true: false}/>
          Recurring
        </label>
      </label>
      <br/>
      <div>{
        props.recurring? 
        <label className="recurringDays">
          Select Days:
          <input type="checkbox" id="Monday" value="Monday" checked={props.selectedDays.Monday} onClick={props.getSelectedDay}/><label for="Monday">Monday</label>
          <input type="checkbox" id="Tuesday" value="Tuesday" checked={props.selectedDays.Tuesday} onClick={props.getSelectedDay}/><label for="Tuesday">Tuesday</label>
          <input type="checkbox" id="Wednesday" value="Wednesday" checked={props.selectedDays.Wednesday} onClick={props.getSelectedDay}/><label for="Wednesday">Wednesday</label>
          <input type="checkbox" id="Thursday" value="Thursday" checked={props.selectedDays.Thursday} onClick={props.getSelectedDay}/><label for="Thursday">Thursday</label>
          <input type="checkbox" id="Friday" value="Friday" checked={props.selectedDays.Friday} onClick={props.getSelectedDay}/><label for="Friday">Friday</label>
          <input type="checkbox" id="Saturday" value="Saturday" checked={props.selectedDays.Saturday} onClick={props.getSelectedDay}/><label for="Saturday">Saturday</label>
          <input type="checkbox" id="Sunday" value="Sunday" checked={props.selectedDays.Sunday} onClick={props.getSelectedDay}/><label for="Sunday">Sunday</label>
        </label> : null
      }</div>
      <br/>
      <label>Current Uploaded Audio Reminder:
        <br />
        <audio src={props.audio} controls></audio>
      </label>
      <br />
      <label>Upload Audio Message:
        <AudioUpload getAudio={props.getAudio} />
      </label>
      <br />
      <label>Title:
        <input type="text" value={props.title} className="title" placeholder="Title" onChange={props.getInput} />
      </label>
      <br />
      <label>Notes:
        <input type="text" value={props.note} className="note" placeholder="Notes" onChange={props.getInput}/>
      </label>
      <br />
      <input type="submit" value="Submit" onClick={props.submitForm}/>
    </form>
  </div>
);

module.exports = ReminderList;

