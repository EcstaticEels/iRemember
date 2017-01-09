import React from 'react';
import {Button, Row, Col, Grid} from 'react-bootstrap';
import ImagesUpload from './webImagesUpload.js';
import AudioUpload from './webAudioUpload.js';

var FaceForm = (props) => {
  var uploadedPhotos = props.editMode ?       
    (<label>Current Uploaded Photos:
      <div>
        {props.photos.length > 0 ? props.photos.map((photoObj, ind) => <img src={photoObj.photo} key={ind} height="100" width="130"/>) : null}
      </div>
      <br />
    </label>) : null;

  var uploadedAudio = props.editMode ? 
    (<label>Current Uploaded Audio Reminder:
      <br />
      <audio src={props.audio} controls></audio>
      <br />
    </label>) : null;

  return (
    <Grid>
      <div className="face-form">
        <Row className="show-grid">
          <h5>New Face</h5>
        </Row>
        <form>
        <Row className="show-grid">
          <label>
            Name:
            <input type="text" value={props.subjectName} className="subjectName" placeholder="Name" onChange={props.getInput}/>
            <br/>
          </label>
        </Row>
        <Row className="show-grid">
          <label>Image:
            <ImagesUpload getPhotos={props.getPhotos}/>
            <br />
          </label>
        </Row>
        <Row className="show-grid">
          {uploadedPhotos}
        </Row>
        <Row className="show-grid">
          <label>Upload Audio Message:
            <AudioUpload getAudio={props.getAudio} />
            <br/>
          </label>
        </Row>
        <Row className="show-grid">
          {uploadedAudio}
        </Row>
        <Row className="show-grid">
          <label>Description:
            <input type="text" value={props.description} className="description" placeholder="Description" onChange={props.getInput}/>
            <br/>
          </label>
        </Row>
          <input type="submit" value="Submit" onClick={props.submitForm} />
        </form>
    </div>
  </Grid>
  );
}

module.exports = FaceForm;