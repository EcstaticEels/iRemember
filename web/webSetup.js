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
      loader: false,
      patientPhotos: []
    }
  }

  componentDidMount() {
    $.ajax({
      method: 'GET',
      url: '/web/faces/patients',
      success: function(res, textStatus, xhr) {
        console.log(xhr.status)
        if (xhr.status === 201) { //if we are updating not creating a patient
          var parsed = JSON.parse(res);
          this.setState({
            patientPhotos: parsed.patientPhotos,
            patientName: parsed.patientName
          }, () => {
            console.log(this.state);
          })
        } 
      }.bind(this),
      error: function(err) {
        console.log('error', err);
      }
    })
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
    var method = 'POST';
    if (caregiverName.get() && !needsSetup.get()) {
      method = 'PUT';
    }
    $.ajax({
      method: method,
      url: '/web/faces/patients',
      data: formData,
      processData: false,
      contentType: false,
      success: function(res) {
        var parsed = JSON.parse(res);
        if (caregiverName.get() && !needsSetup.get()) { //if the account does not need setup
          patientName.set(parsed.patient.name);
        } else if (caregiverName.get() && needsSetup.get()) { //if the account just completed setup
          needsSetup.set(false);
          caregiverName.set(parsed.caregiver.name);
          patientName.set(parsed.patient.name);
        }
        that.setState({
          loader: false
        }, () => {
          browserHistory.push('/patient/reminders');
        });
      }.bind(this),
      error: function(err) {
        console.log('error', err);
      }
    });
  }

  render() {
    const spinner = <span><img src={'/default.svg'} /></span>;
    const patientHeader = needsSetup.get() ? 'Add your patient settings' : 'Update your patient settings';
    var cloudinaryUrls = this.state.patientPhotos.map(function(photoObj) {
      return photoObj.photo;
    });
    var thumbnailPhotos = this.props.handleCloudinaryUrl(cloudinaryUrls, '134', '94', 'thumb');
    var patientPhotos = !needsSetup.get() ?       
      (<label>
        <div className="setup-face-form">
        {thumbnailPhotos.length > 0 ? thumbnailPhotos.map((val, ind) => {
          return <img src={val} key={ind} className="preview-img front" />
        }) : null}
        </div>
      </label>) : null;
    return (
      <Grid>
        <Loader show={this.state.loader} message={spinner} foregroundStyle={{color: 'white'}} backgroundStyle={{backgroundColor: 'white'}} className="spinner">
        <form>
          <Row className="patient-header">
            <h1>{patientHeader}</h1>
          </Row>
          <Row className="show-grid">
            <Col md={5}>
              {patientPhotos}
            </Col>
            <Col md={7}>
              <label>
                Patient Name:
                <br/>
                <input type="text" value={this.state.patientName} className="patientName" placeholder="Patient Name" onChange={this.getInput.bind(this)}/>
                <br/>
              </label>
              <ImagesUpload uploadedPhotos={this.state.updatePatientPhotos} getPhotos={this.getPhotos.bind(this)}/>
              <input className="save-btn" type="submit" value="Save" onClick={this.submitForm.bind(this)} />
            </Col>
          </Row>
          
        </form>
        </Loader>
      </Grid>
    );
  }
}