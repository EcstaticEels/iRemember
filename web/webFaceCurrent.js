import React from 'react';

var FaceCurrent = (props) => {
  var edit = () => {
    props.edit(props.current);
  }

  return (
    <div className="face-current">
      <img src={props.current.img} height="200" width="200"/>
      <div>{props.current.time}</div>
      <div>{props.current.note}</div>
      <button onClick={edit}>Edit</button>
    </div>
  )
};

module.exports = FaceCurrent;
