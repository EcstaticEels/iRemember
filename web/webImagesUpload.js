import React from 'react';
import {ControlLabel} from 'react-bootstrap';
import Dropzone from 'react-dropzone'

export default class ImagesUpload extends React.Component {
  constructor(props) {
    super(props);
  }

  getimageUploadText() {
    if (!this.props.uploadedPhotos) {
      return 'No file chosen';
    }
    var numFiles = this.props.uploadedPhotos.length;
    if(numFiles === 0) {
      return 'No file chosen';
    } else if(numFiles === 1) {
      return this.props.uploadedPhotos[0].name;
    } else {
      return numFiles + ' files uploaded';
    }
  }

  render() {
    return (
      <div className="image-upload" name="file" encType="multipart/form-data">
        <ControlLabel> {'Upload an Image:'} </ControlLabel>
        <Dropzone className='dropzone' onDrop={this.props.getPhotos} encType="multipart/form-data" multiple>
          <h3 className='dropzone-text'>Drop files here or click to upload.</h3>
        </Dropzone>
        <input type="file" className="img" onChange={this.props.getPhotos} accept="image/*" required multiple/>
        <label className='photos-num' htmlFor="img">{this.getimageUploadText()}</label>
      </div>
    )
  }
  
}
