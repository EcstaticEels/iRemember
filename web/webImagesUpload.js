import React from 'react';

var ImageUpload = (props) => (
  <div className="image-upload" encType="multipart/form-data">
    <input type="text" className="imgName"/><br/>
    <input type="file" className="img" onChange={props.getPhotos} multiple/><br/>
  </div>
);

module.exports = ImageUpload;
