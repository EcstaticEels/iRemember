import React from 'react';
import {Button, Row, Col, Grid} from 'react-bootstrap';
import ImagesUpload from './webImagesUpload.js';
import $ from 'jquery';

import {observer} from 'mobx-react';
import {caregiverName, needsSetup} from './webMobxStore';
import {browserHistory} from 'react-router';


@observer
export default class Setup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      updatePatientPhotos: '',
      patientName: '',
    }
  }

  getPhotos(event){
    this.setState({
      updatePhotos: event.target.files
    });
  }

  getInput(event) {
    var key = event.target.getAttribute('class');
    var value = event.target.value;
    var obj = {};
    obj[key] = value;
    this.setState(obj, () => {
      console.log(this.state)
    });
  }

  getPhotos(event){
    this.setState({
      updatePatientPhotos: event.target.files
    });
  }

  submitForm(event) {
    event.preventDefault();
    var that = this;
    var formData = new FormData();
    formData.append('patientName', this.state.patientName);
    for (var key in this.state.updatePatientPhotos) {
      formData.append('patientPhoto', this.state.updatePatientPhotos[key]);
    }
    $.ajax({
      method: 'POST',
      url: '/web/setup',
      data: formData,
      processData: false,
      contentType: false,
      success: function(res) {
        console.log(res);
        var parsedData = JSON.parse(res);
        needsSetup.set(false);
        console.log('needsSetup now', needsSetup.get())
        browserHistory.push('/reminders');
      },
      error: function(err) {
        console.log('error', err);
      }
    });
  }

  render() {
    return (
      <Grid>
        <form>
          <Row className="show-grid">
            <h1>Setup Your Account</h1>
          </Row>
          <Row className="show-grid">
            <label>
              Patient Name:
              <input type="text" value={this.state.patientName} className="patientName" placeholder="Patient Name" onChange={this.getInput.bind(this)}/>
              <br/>
            </label>
          </Row>
          <Row className="show-grid">
            <label>Upload photos of patient:
              <ImagesUpload getPhotos={this.getPhotos.bind(this)}/>
              <br />
            </label>
          </Row>
          <input type="submit" value="Submit" onClick={this.submitForm.bind(this)} />
        </form>
      </Grid>
    );
  }
}