import React from 'react';

import Gallery from './webGallery.js';


var FaceCurrent = (props) => {
  var edit = () => {
    props.edit(props.current);
  }

  return (
    <div className="face-current">
      <h1>{props.current.subjectName}</h1>
      <Gallery photos={props.current.photos}/>
      <div><h3>Description: </h3>{props.current.description}</div>
      <button onClick={edit}>Edit</button>
    </div>
  )
};

module.exports = FaceCurrent;
