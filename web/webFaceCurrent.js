import React from 'react';

import Gallery from './webGallery.js';


var FaceCurrent = (props) => {
  var edit = () => {
    props.edit(props.current);
  }

  return (
    <div className="face-current">

      <Gallery photos={props.current.photos}/>
      <div>{props.current.subjectName}</div>
      <div>{props.current.description}</div>
      <button onClick={edit}>Edit</button>
    </div>
  )
};

module.exports = FaceCurrent;
