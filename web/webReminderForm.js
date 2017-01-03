import React from 'react';

import ImageUpload from './webImageUpload.js';

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

var ReminderList = (props) => (
  <div className="reminder-form">
    <h5>New Reminder</h5>
    <form>
    <label>Picture:
    <ImageUpload/>
    </label>
    <label>Time:
      <select className="month" onChange={props.getInput}>{
        months.map((month, ind) => <option value={ind} key={ind}>{month}</option>)
      }</select>
      <input type="text" className="day" placeholder="Day" onKeyUp={props.getInput}/>
      <input type="text" className="year" placeholder="Year" onKeyUp={props.getInput}/>
      <select className="hour" onChange={props.getInput}>{
        months.map((val, ind) => <option value={ind + 1} key={ind + 1}>{ind + 1}</option>)
      }</select>
      <input type="text" className="minute" placeholder="minute" onKeyUp={props.getInput}/>
      <label>
        <input name="time" className="time" type="radio" value={false} onChange={props.getInput}/>
        AM
      </label>
      <label>
        <input name="time" className="time" type="radio" value={true} onChange={props.getInput}/>
        PM
      </label>
    </label>
    <br/>
    <label>Recurring:
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
    <input type="submit" value="Submit"/>
    </form>
  </div>
);

module.exports = ReminderList;
