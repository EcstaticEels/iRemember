import React from 'react';

var ImagesUpload = (props) => (
  <div className="image-upload" name="file" encType="multipart/form-data">
    <input type="file" className="img" onChange={props.getPhotos}  multiple/>
    <label className='photos-num' htmlFor="img">{props.numFiles} files uploaded</label>
  </div>
);

module.exports = ImagesUpload;
