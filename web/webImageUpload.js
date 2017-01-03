import React from 'react';

var ImageUpload = (props) => (
  <div className="image-upload">
      <input type="text" className="imgName"/><br/>
      <input type="file" className="img" multiple="multiple" onChange={props.getInput}/><br/>
      <div>{
        props.editMode ? <img src={props.img} height="100" width="100"/> : null
      }</div>
  </div>
);

module.exports = ImageUpload;


