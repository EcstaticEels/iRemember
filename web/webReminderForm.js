import React from 'react';
import {Button, Row, Col, Grid} from 'react-bootstrap';
import AudioUpload from './webAudioUpload.js';
import Moment from 'moment';
// import { TransitionView, Calendar, DateField, DatePicker } from 'react-date-picker';
import Datetime from 'react-datetime';

import MSR from 'msr';

import {observer} from 'mobx-react';
import {reminderForm} from './webMobxStore';

@observer
export default class ReminderForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recorded: false,
    }
  }

  captureUserMedia(mediaConstraints, successCallback, errorCallback) {
    mediaConstraints = {
      audio: true
    }
    navigator.mediaDevices.getUserMedia(mediaConstraints).then(successCallback).catch(errorCallback);
    console.log('captureUserMedia THIS:', this);
  }

  startRecording() {
    // $('#start-recording').disabled = true;
    // audiosContainer = document.getElementById('audios-container');
    // console.log('startRecording()');
    console.log('startRecording THIS:', this);
    var that = this;
    this.captureUserMedia(this.mediaConstraints, this.onMediaSuccess.bind(that), this.onMediaError);
  };

  stopRecording() {
    var mediaRecorder = window.mediaRecorder;
    // $('#stop-recording').disabled = true;
    mediaRecorder.stop();
    mediaRecorder.stream.stop();
    // $('.start-recording').disabled = false;
  };

  // mediaRecorder = this.store.mediaRecorder;

  onMediaSuccess(stream) {
    window.mediaRecorder = new MSR(stream);
    var mediaRecorder = window.mediaRecorder;
    mediaRecorder.stream = stream;
    mediaRecorder.mimeType = 'audio/wav';
    mediaRecorder.audioChannels = 1;
    mediaRecorder.sampleRate = 44100;
    console.log('before mediaRecorder THIS: ', this);
    mediaRecorder.ondataavailable = function(blob) {
      // $('#record-audio').html("<audio controls=''><source src=" + URL.createObjectURL(blob) + "></source></audio>");

      // var url = (window.URL || window.webkitURL).createObjectURL(blob);
      var tempFileName = Date.now().toString() + '.wav';

      // var link = document.getElementById("save");
      // link.href = url;
      // link.download = tempFileName;

      // link.download = filename || 'output.wav';
      // console.log('onMediaSuccess THIS:', this);

      // var file =
      // url.lastModifiedDate = new Date();
      // url.name = link.download;
      // this.onDrop(blob);

      var file = new File([blob], tempFileName);
      reminderForm.audioFile = file;
      var blobUrl = URL.createObjectURL(blob);
      reminderForm.audioUrl = blobUrl;
      this.setState({
        recorded: true
      })
    }.bind(this);

    var timeInterval = 360 * 1000;

    mediaRecorder.start(timeInterval);

    // $('#stop-recording').disabled = false;
  }
  onMediaError(e) {
    console.error('media error', e);
  }

  // bytesToSize(bytes) {
  //   var k = 1000;
  //   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  //   if (bytes === 0) return '0 Bytes';
  //   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)), 10);
  //   return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
  // }

  // getTimeLength(milliseconds) {
  //   var data = new Date(milliseconds);
  //   return data.getUTCHours() + " hours, " + data.getUTCMinutes() + " minutes and " + data.getUTCSeconds() + " second(s)";
  // }
  // End of audio audio recorde'acl', 'public-read'r
 
  
  render() {
    return (
      <div className="reminder-form">
        <h4>New Reminder</h4>
        <form>
          <label>
            Time:
            <Datetime className='date' value={this.props.date}
            onChange={(dateMoment) => {
              this.props.handleDateChange(dateMoment);
            }}/>
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
          <label>Upload Audio Message:
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
        <br/>
          <div className="record-stop-button">
            <button className="general-button" onClick={this.startRecording.bind(this)}>Record</button>
            <button className="general-button" onClick={this.stopRecording.bind(this)}>STOP</button>
          </div>
          <div className="recorded-audio-box">
            <AudioUpload getAudio={(event) => {
              reminderForm.audioFile = event.target.files;
            }}/> 
            <div id="record-audio">
              {this.state.recorded || this.props.editMode? <audio src={reminderForm.audioUrl} controls></audio> : null}
            </div>
          </div>
      </div>
    );
  }
}