import React from 'react';

var ImageUpload = (props) => (
  <div className="image-upload" encType="multipart/form-data">
      <input type="text" className="imgName"/><br/>
      <input type="file" className="img" onChange={props.getPhotos} multiple/><br/>
      <div>{
        props.editMode ? props.photos.map((photo, ind) => <img src={photo} key={ind} height="100" width="100"/>) : null
      }</div>
  </div>
);

module.exports = ImageUpload;
