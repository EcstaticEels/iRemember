import React from 'react';
// import LightboxComponent from 'react-lightbox-component';

// var Lightbox = LightboxComponent.Lightbox

var FaceCurrent = (props) => {
  var edit = () => {
    props.edit(props.current);
  }

  return (
    <div className="face-current">
      <img src={props.current.photos[0].photo} height="200" width="200"/>
      <div>{props.current.subjectName}</div>
      <div>{props.current.description}</div>
      <button onClick={edit}>Edit</button>
    </div>
  )
};

module.exports = FaceCurrent;
