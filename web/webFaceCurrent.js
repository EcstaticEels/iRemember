import React from 'react';
import ReactAudioPlayer from 'react-audio-player';
import Gallery from './webGallery.js';
import { observable } from 'mobx';
import {caregiverName, patientName} from './webMobxStore';

const PHOTO_SET = [
  {
    src: 'http://res.cloudinary.com/dgpb4nmh4/image/upload/v1484359811/k46fkclgxiy1xfcz1un4.jpg',
    width: 540,
    height: 960,
    aspectRatio: 1,
    lightboxImage:{
    src: 'http://example.com/example/img1_large.jpg',
    srcset: [
      'http://example.com/example/img1_1024.jpg 1024w',
      'http://example.com/example/img1_800.jpg 800w',
      'http://example.com/example/img1_500.jpg 500w',
      'http://example.com/example/img1_320.jpg 320w',
    ]
    }
  },
  {
    src: 'http://res.cloudinary.com/dgpb4nmh4/image/upload/v1484359023/e2jsv2mkxxsy1lfrqrgs.jpg',
    width: 540,
    height: 960,
    aspectRatio: 1,
    lightboxImage:{
    src: 'http://example.com/example/img2_large.jpg',
    srcset: [
      'http://example.com/example/img2_1024.jpg 1024w',
      'http://example.com/example/img2_800.jpg 800w',
      'http://example.com/example/img2_500.jpg 500w',
      'http://example.com/example/img2_320.jpg 320w',
    ]
    }
  }
];

export default class FaceCurrent extends React.Component {
  constructor(props) {
    super(props);
  }

  edit() {
    this.props.edit(this.props.current);
  }

  render() {
    var galleryView = this.props.current.photos.length > 0 ? <Gallery photos={this.props.current.photos}/> : null;
    // var galleryView = <Gal photos={PHOTO_SET} />
    var currentView;
    var audioView = this.props.current.audio ? <ReactAudioPlayer src={this.props.current.audio} /> : <h4>No audio set for this face</h4>;
    if (!!this.props.current.subjectName) {
      currentView = (
        <div className="face-current">
          <h1>{this.props.current.subjectName}</h1>
          {galleryView}
          <div><h3>Description: </h3>{this.props.current.description}</div>
          <label><h3>Audio Message:</h3>
            {audioView}
          </label>
          <br />
          <button onClick={this.edit.bind(this)}>Edit</button>
        </div>
      );
    } else {
      currentView = (
        <div className="face-current">
          <h1>Add a person to {patientName.get()}'s face gallery</h1>
        </div>
      );
    }
    return currentView;
  }
};

