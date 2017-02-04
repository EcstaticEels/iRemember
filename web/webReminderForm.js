import React from 'react';
import {Button, Row, Col, Grid, FormControl, FormGroup, InputGroup, ControlLabel, DropdownButton, MenuItem, Radio, Checkbox} from 'react-bootstrap';

// Be sure to include styles at some point, probably during your bootstrapping
// import 'react-select/dist/react-select.css';
import AudioUpload from './webAudioUpload.js';
import Moment from 'moment';
import Datetime from 'react-datetime';

import MSR from 'msr';

import {observer} from 'mobx-react';
import {reminderForm} from './webMobxStore';

@observer
export default class ReminderForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recording: false,
      recorded: false,
      upload: false
    }
  }

  getAudio(event) {
    reminderForm.audioFile = event.target.files[0];
    var url = URL.createObjectURL(event.target.files[0]);
    reminderForm.audioUrl = url;
    this.setState({
      recorded: true
    })
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
    var that = this;
    this.setState({
      recording: true
    })
    this.captureUserMedia(this.mediaConstraints, this.onMediaSuccess.bind(that), this.onMediaError);
  };

  stopRecording() {
    var mediaRecorder = window.mediaRecorder;
    this.setState({
      recording: false
    })
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

  validateTitle() {
    return this.props.title.length > 0 && this.props.title.length < 40? 'success': 'error';
  }

  validateDate() {
    return typeof this.props.date === 'object' ? 'success': 'error'
  }

  showUpload() {
    this.setState({
      upload: !this.state.upload
    })
  }

  audioPart() {
    if(this.state.recording) {
      return(
        <div><Button className="pause-button" onClick={this.stopRecording.bind(this)}>
          <i className="fa fa-pause"></i>STOP</Button>
          <i className="fa fa-circle text-danger Blink"></i>LIVE</div>)
    } else if(this.state.upload) {
      return (
        <div className="audio-uploading">
        <Row>
          <Button className="record-button" onClick={this.startRecording.bind(this)}>
            <i className="fa fa-circle text-danger"></i> Record</Button>
          <Button className="upload-button" onClick={this.showUpload.bind(this)}>Upload a File</Button>
        </Row>
        <div className="recorded-audio-box">
          <AudioUpload getAudio={this.getAudio.bind(this)}/></div>
        </div>
      )
    } else {
      return (<Row>
        <Button className="record-button" onClick={this.startRecording.bind(this)}>
          <i className="fa fa-circle text-danger"></i> Record</Button>
        <Button className="upload-button" onClick={this.showUpload.bind(this)}>Upload a File</Button>
      </Row>)
    }
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
        <h3 className="reminder-form-heading">Add a New Reminder</h3>
        <FormGroup>
          <DropdownButton 
            className='reminder-type-btn'
            title={this.props.type.slice(0,1).toUpperCase() + this.props.type.slice(1)} 
            id="type" value={this.props.type} 
            onSelect={(event) => this.props.getType(event)} required>
            <MenuItem eventKey="Medication" value='Medication'>Medication</MenuItem>
            <MenuItem eventKey="Event" value='Event'>Event</MenuItem>
            <MenuItem eventKey='Chores' value="Chores">Chores</MenuItem>
            <MenuItem eventKey='Social Engagement' value="Social Engagement">Social Engagement</MenuItem>
            <MenuItem eventKey='Doctor Appointment' value="Doctor Appointment">Doctor Appointment</MenuItem>
            <MenuItem eventKey='Groceries' value="Groceries">Groceries</MenuItem>
            <MenuItem eventKey='Exercise' value="Exercise">Exercise</MenuItem>
            <MenuItem eventKey='Other' value="Other">Other</MenuItem>
          </DropdownButton>
        </FormGroup>

        <FormGroup validationState={this.validateTitle()}>
          <ControlLabel> {'Title:'} </ControlLabel>
          <FormControl 
            type="text" value={this.props.title} 
            id="title" placeholder="Title" 
            onChange={this.props.getInput} />
        </FormGroup>

        <FormGroup>
          <ControlLabel> {'Notes:'} </ControlLabel>
          <FormControl
            type="text" value={this.props.note} 
            id="note" placeholder="Notes" 
            onChange={this.props.getInput} />
        </FormGroup>

        <FormGroup validationState={this.validateDate()}>
          <ControlLabel> {'Date & Time:'} </ControlLabel>
          <InputGroup>
            <Datetime 
              className='datetime'
              id='date' 
              value={this.props.date}
              onChange={(dateMoment) => {
                this.props.handleDateChange(dateMoment);
            }}/>
            <InputGroup.Addon>
              <Radio
                name="recurring"
                id="recurring"
                className="recurring"
                type="radio"
                value={false}
                onChange={this.props.getBoolean}
                checked={this.props.recurring? false: true} inline>Once</Radio>
              <Radio
                name="recurring"
                id="recurring"
                className="recurring"
                type="radio"
                value={true}
                onChange={this.props.getBoolean}
                checked={this.props.recurring? true: false} inline>Recurring</Radio>
            </InputGroup.Addon>
          </InputGroup>
        </FormGroup>
           
         <FormGroup>{
          this.props.recurring? 
          <FormGroup className="recurringDays">
            <Checkbox 
              type="checkbox" id="Monday" value="Monday" 
              checked={this.props.selectedDays.Monday} 
              onClick={this.props.getSelectedDay} inline> Monday </Checkbox>
            <Checkbox 
              type="checkbox" id="Tuesday" value="Tuesday" 
              checked={this.props.selectedDays.Tuesday} 
              onClick={this.props.getSelectedDay} inline> Tuesday </Checkbox>
            <Checkbox 
              type="checkbox" id="Wednesday" value="Wednesday" 
              checked={this.props.selectedDays.Wednesday} 
              onClick={this.props.getSelectedDay} inline> Wednesday </Checkbox>
            <Checkbox 
              type="checkbox" id="Thursday" value="Thursday" 
              checked={this.props.selectedDays.Thursday} 
              onClick={this.props.getSelectedDay} inline> Thursday </Checkbox>
            <Checkbox 
              type="checkbox" id="Friday" value="Friday" 
              checked={this.props.selectedDays.Friday} 
              onClick={this.props.getSelectedDay} inline> Friday </Checkbox>
            <Checkbox 
              type="checkbox" id="Saturday" value="Saturday"
              checked={this.props.selectedDays.Saturday}
              onClick={this.props.getSelectedDay} inline> Saturday </Checkbox>
            <Checkbox 
              type="checkbox" id="Sunday" value="Sunday"
              checked={this.props.selectedDays.Sunday}
              onClick={this.props.getSelectedDay} inline> Sunday </Checkbox>
          </FormGroup> : null
        }</FormGroup>

        <ControlLabel> {'Previously Uploaded Audio Message:'} </ControlLabel>
        <FormGroup className="reminder-form-btns">{this.audioPart()}</FormGroup>

        <FormGroup>{
          this.state.recorded || (this.props.editMode && reminderForm.audioUrl)? 
          <audio src={reminderForm.audioUrl} controls></audio> : null
        }</FormGroup>
        
        <Button className="reminder-form-submit-btn" type="submit" value="Submit" onClick={this.props.submitForm}>Submit</Button>

      </div>
    );
  }
}

// <div className="record-stop-button">{ 
//             this.state.recording ?
//               
//               : <Button className="general-button" onClick={this.startRecording.bind(this)}><i className="fa fa-circle text-danger"></i> Record</Button>
//           }</div>