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
      success: function(res) {
        var parsed = JSON.parse(res);
        this.setState({
          patientPhotos: parsed.patientPhotos,
          patientName: parsed.patientName
        }, () => {
          console.log(this.state);
        })
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
        if (caregiverName.get() && needsSetup.get()) {
          var parsedData = JSON.parse(res);
          needsSetup.set(false);
          this.props.getUserInfo(() => {
            if (res) {
              var parsed = JSON.parse(res);
              caregiverName.set(parsed.caregiver.name);
              if (parsed.patient) {
                patientName.set(parsed.patient.name);
              }
            }
          })
        }
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
    const spinner = <span><img src={'/default.svg'} /></span>;
    const patientHeader = needsSetup.get() ? 'Add your patient' : 'Update your patient';
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
        <Loader show={this.state.loader} message={spinner} foregroundStyle={{color: 'white'}} backgroundStyle={{backgroundColor: 'white'}} className="spinner">
        <form>
          <Row className="show-grid">
            <h1>{patientHeader}</h1>
          </Row>
          <Row className="show-grid">
            {patientPhotos}
          </Row>
          <Row className="show-grid">
            <label>
              Patient Name:
              <input type="text" value={this.state.patientName} className="patientName" placeholder="Patient Name" onChange={this.getInput.bind(this)}/>
              <br/>
            </label>
          </Row>
          <Row className="show-grid">
            <ImagesUpload uploadedPhotos={this.state.updatePatientPhotos} getPhotos={this.getPhotos.bind(this)}/>
            <br />
          </Row>
          <input type="submit" value="Submit" onClick={this.submitForm.bind(this)} />
        </form>
        </Loader>
    );
  }
}