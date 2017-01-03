import React from 'react';

var FaceEntry = (props) => {
  
  var changeCurrent = () => {
    props.updateCurrent(props.data);
  }

  return (
    <div className="face-entry" onClick={changeCurrent}>
      <img src={props.data.img} height="100" width="100"/>
      <div>{props.data.time}</div>
      <div>{props.data.note}</div>
    </div>
  )
};

module.exports = FaceEntry;