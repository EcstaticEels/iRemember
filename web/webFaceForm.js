import React from 'react';

import ImageUpload from './webImageUpload.js';

var FaceList = (props) => (
  <div className="face-form">
    <h5>New Face</h5>
    <form>
    <label>Picture:
    <ImageUpload img={props.img} getInput={props.getInput} editMode={props.editMode}/>
    </label>
    <br/>
    <label>
      Time:
      <input className="time" type="datetime-local" value={props.time} onChange={props.getInput}/>
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
          onChange={props.getInput}
          checked={props.recurring === "false"? true: false}/>
        Once
      </label>
      <label>
        <input 
          name="recurring"
          className="recurring"
          type="radio"
          value={true}
          onChange={props.getInput}
          checked={props.recurring === "true"? true: false}/>
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
    <input type="text" value={props.note} className="note" placeholder="Notes" onKeyUp={props.getInput}/>
    <br/>
    <input type="submit" value="Submit" onClick={props.submitForm}/>
    </form>
  </div>
);

module.exports = FaceList;