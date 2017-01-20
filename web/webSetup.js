import React from 'react';
import {Button, Row, Col, Grid} from 'react-bootstrap';
import ImagesUpload from './webImagesUpload.js';
import $ from 'jquery';

import {observer} from 'mobx-react';
import {caregiverName, needsSetup, patientName} from './webMobxStore';
import {browserHistory} from 'react-router';
import Loader from 'react-loader-advanced';

@observer
export default class Setup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      updatePatientPhotos: '',
      patientName: '',
      loader: false
    }
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

  getPhotos(e){
    var files = e.target ? e.target.files : e
    this.setState({
      updatePatientPhotos: files
    });
  }

  submitForm(event) {
    event.preventDefault();
    this.setState({
      loader: true
    });
    var that = this;
    var formData = new FormData();
    formData.append('patientName', this.state.patientName);
    for (var key in this.state.updatePatientPhotos) {
      formData.append('patientPhoto', this.state.updatePatientPhotos[key]);
    }
    console.log('about to send request to post setup', this.state.updatePatientPhotos)
    $.ajax({
      method: 'POST',
      url: '/web/setup',
      data: formData,
      processData: false,
      contentType: false,
      success: function(res) {
        var parsedData = JSON.parse(res);
        console.log('patient', parsedData);
        needsSetup.set(false);
        console.log('needsSetup now', needsSetup.get())
        this.props.getUserInfo(() => {
          if (res) {
            var parsed = JSON.parse(res);
            caregiverName.set(parsed.caregiver.name);
            if (parsed.patient) {
              patientName.set(parsed.patient.name);
            }
          }
        })
        that.setState({
          loader: false
        }, () => {
          browserHistory.push('/reminders');
        });
      }.bind(this),
      error: function(err) {
        console.log('error', err);
      }
    });
  }

  render() {
    const spinner = <span><img src={'/default.svg'} /></span>
    return (
        <Loader show={this.state.loader} message={spinner} foregroundStyle={{color: 'white'}} backgroundStyle={{backgroundColor: 'white'}} className="spinner">
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
              <ImagesUpload uploadedPhotos={this.state.updatePatientPhotos} getPhotos={this.getPhotos.bind(this)}/>
              <br />
            </label>
          </Row>
          <input type="submit" value="Submit" onClick={this.submitForm.bind(this)} />
        </form>
        </Loader>
    );
  }
}