import React from 'react';
import {Button, Row, Col, Grid} from 'react-bootstrap';
import ImagesUpload from './webImagesUpload.js';
import AudioUpload from './webAudioUpload.js';

export default class FaceForm extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var uploadedPhotos = this.props.editMode ?       
      (<label>Current Uploaded Photos:
        <div>
          {this.props.photos.length > 0 ? this.props.photos.map((photoObj, ind) => <img src={photoObj.photo} key={ind} height="100" width="130"/>) : null}
        </div>
        <br />
      </label>) : null;

    var uploadedAudio = this.props.editMode ? 
      (<label>Current Uploaded Audio Reminder:
        <br />
        <audio src={this.props.audio} controls></audio>
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
              <input type="text" value={this.props.subjectName} className="subjectName" placeholder="Name" onChange={this.props.getInput}/>
              <br/>
            </label>
          </Row>
          <Row className="show-grid">
            <label>Image:
              <ImagesUpload getPhotos={this.props.getPhotos}/>
              <br />
            </label>
          </Row>
          <Row className="show-grid">
            {uploadedPhotos}
          </Row>
          <Row className="show-grid">
            <label>Upload Audio Message:
              <AudioUpload getAudio={this.props.getAudio} />
              <br/>
            </label>
          </Row>
          <Row className="show-grid">
            {uploadedAudio}
          </Row>
          <Row className="show-grid">
            <label>Description:
              <input type="text" value={this.props.description} className="description" placeholder="Description" onChange={this.props.getInput}/>
              <br/>
            </label>
          </Row>
            <input type="submit" value="Submit" onClick={this.props.submitForm} />
          </form> 
        </div>
      </Grid>
    );
  }
}

