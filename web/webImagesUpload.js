import React from 'react';
import {ControlLabel} from 'react-bootstrap';
import Dropzone from 'react-dropzone'

var ImagesUpload = (props) => (
  <div className="image-upload" name="file" encType="multipart/form-data">
    <ControlLabel> {'Image:'} </ControlLabel>
    <Dropzone className='dropzone' onDrop={props.getPhotos} encType="multipart/form-data" multiple>
      <h3 className='dropzone-text'>Drop files here or click to upload.</h3>
    </Dropzone>
    <input type="file" className="img" onChange={props.getPhotos}  multiple/>
    <label className='photos-num' htmlFor="img">{props.numFiles} files uploaded</label>
  </div>
);

module.exports = ImagesUpload;
