import React from 'react';

var FaceEntry = (props) => {
  
  var changeCurrent = () => {
    props.updateCurrent(props.data);
  }

  return (
    <div className="face-entry" onClick={changeCurrent}>
      <img src={props.data.photos[0].photo} height="100" width="100"/>
      <div>{props.data.subjectName}</div>
    </div>
  )
};

module.exports = FaceEntry;