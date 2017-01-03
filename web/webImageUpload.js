import React from 'react';

var ImageUpload = (props) => (
  <div className="image-upload">
      <input type="text" className="imgName"/><br/>
      <input type="file" className="img" multiple="multiple" onChange={props.getInput}/><br/>
  </div>
);

module.exports = ImageUpload;

// action="/web/identify" enctype="multipart/form-data" method="POST"


