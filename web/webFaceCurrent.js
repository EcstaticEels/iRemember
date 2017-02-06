import React from 'react';
import ReactAudioPlayer from 'react-audio-player';
import Gallery from './webGallery.js';
import { observable } from 'mobx';
import {caregiverName, patientName} from './webMobxStore';
import {Button, Row, Col} from 'react-bootstrap';

export default class FaceCurrent extends React.Component {
  constructor(props) {
    super(props);
  }

  edit() {
    this.props.edit(this.props.current);
  }

  render() {
    var galleryView = this.props.current.photos.length > 0 ? <Gallery photos={this.props.current.photos} handleCloudinaryUrl={this.props.handleCloudinaryUrl}/> : null;
    var currentView;
    var audioView = this.props.current.audio ? <ReactAudioPlayer src={this.props.current.audio} /> : <h5>No audio submitted yet for this face</h5>;
    if (!!this.props.current.subjectName) {
      currentView = (
      <Row>
        <div className="face-current">
            <Col md={6}>
              {galleryView}
            </Col>
            <Col md={6} className="face-current-patient-info">
              <h1 className="face-current-name">{this.props.current.subjectName + ' '}
              <span className="current-edit-delete-btns">
                <i className="edit fa fa-pencil-square-o" onClick={this.edit.bind(this)} aria-hidden="true"></i>
                <i className="trash fa fa-trash-o" onClick={this.props.delete} aria-hidden="true"></i>
              </span>
              </h1>
                <div className='face-description'> 
                  <h3 className='face-current-header'>Description </h3>
                  <h5>{this.props.current.description}</h5>
                </div>
                <div className='face-audio'>
                  <h3 className='face-current-header'>Audio Message </h3>
                  {audioView}
                </div>
            </Col>
        </div>
      </Row>
      );
    } else {
      currentView = (
        <div className="face-current">
          <h2 className="no-face-current">Add a person to {patientName.get()}'s face gallery</h2>
        </div>
      );
    }
    return currentView;
  }
};

              // <h3 className="face-current-relationship">Aquaintence</h3>
              //   <div className='face-age'>
              //     <h3 className='face-current-header'>Age </h3>
              //     <h5>24</h5>
              //   </div>
              //   <div className='face-occupation'>
              //     <h3 className='face-current-header'>Occupation </h3>
              //     <h5>Software Engineer</h5>
              //   </div>

