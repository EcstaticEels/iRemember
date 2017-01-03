import React from 'react';

import ImageUpload from './webImageUpload.js';

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

var ReminderList = (props) => (
  <div className="reminder-form">
    <h5>New Reminder</h5>
    <form>
    <label>Picture:
    <ImageUpload getInput={props.getInput}/>
    </label>
    <br/>
    <label>
      Time:
      <input className="time" type="datetime-local" onChange={props.getInput}/>
    </label>
    <br/>
    <label>
      Type:
      <select className="type" onChange={props.getInput}>
        <option value='medication'>Medication</option>
        <option value='appointment'>Appointment</option>
        <option value='others'>Others</option>
      </select>
    </label>
    <br/>
    <label>
      Recurring:
      <label>
        <input name="recurring" className="recurring" type="radio" value={false} onChange={props.getInput}/>
        Once
      </label>
      <label>
        <input name="recurring" className="recurring" type="radio" value={true} onChange={props.getInput}/>
        Recurring
      </label>
    </label>
    <br/>
    <audio controls>
      <source src="horse.ogg" type="audio/ogg"/>
      <source src="horse.mp3" type="audio/mpeg"/>
      Your browser does not support the audio element.
    </audio>
    <br/>
    <label>Notes:</label>
    <br/>
    <input type="text" className="note" placeholder="Notes" onKeyUp={props.getInput}/>
    <br/>
    <input type="submit" value="Submit" onClick={props.submitForm}/>
    </form>
  </div>
);

module.exports = ReminderList;
