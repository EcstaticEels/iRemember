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
        <div className="face-current">
          <h1 className="face-current-heading">{this.props.current.subjectName}</h1>
          <Row className="show-grid">
            {galleryView}
          </Row>
          <Row>
            <div className='face-description'> 
              <h3 className='face-current-header'>Description: </h3>
              <h5>{this.props.current.description}</h5>
            </div>
          </Row>
          <Row>
            <div className='face-audio'>
              <h3 className='face-current-header'>Audio Message: </h3>
              {audioView}
            </div>
          </Row>
            <div className='face-btns'>
              <Button bsSize='small' className="btn-edit" onClick={this.edit.bind(this)}>Edit</Button>
              <Button bsSize='small' className="btn-delete" onClick={this.props.delete}>Delete</Button>
            </div>
        </div>
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

