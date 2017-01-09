import React from 'react';
import ReactAudioPlayer from 'react-audio-player';
import Gallery from './webGallery.js';


var FaceCurrent = (props) => {
  var edit = () => {
    props.edit(props.current);
  };
  var galleryView = props.current.photos.length > 0 ? <Gallery photos={props.current.photos}/> : null;

  return (
    <div className="face-current">
      <h1>{props.current.subjectName}</h1>
      {galleryView}
      <div><h3>Description: </h3>{props.current.description}</div>
      <label><h3>Audio Message:</h3>
        <ReactAudioPlayer src={props.current.audio} />
      </label>
      <br />
      <button onClick={edit}>Edit</button>
    </div>
  )
};

module.exports = FaceCurrent;
