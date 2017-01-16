import React from 'react';
import {Button, Row, Col, Grid} from 'react-bootstrap';
import ImagesUpload from './webImagesUpload.js';
import AudioUpload from './webAudioUpload.js';
import ReactModal from 'react-modal';
import ImagePreviewCrop from './webImagePreviewCrop';

export default class FaceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false, 
      cropInfo: [],
      imagePreviewRerender: true
    }
    // this.openModal = this.openModal.bind(this);
    // this.submitCropPhotos = this.submitCropPhotos.bind(this);
  } 
  ////////!!!!!!!!!!!!!!!!!!!!!!!!
  ////////!!!!!!!!!!!!!!!!!!!!!!!!
    ////////!!!!!!!!!!!!!!!!!!!!!!!!
      ////////!!!!!!!!!!!!!!!!!!!!!!!!
  // componentWillReceiveProps(nextProps) { //need to remember to del final crop info if discarded changes
  //   console.log(nextProps);
  //   if (!nextProps.finalCropInfo && nextProps.imagePreviewUrls.length > 0) {
  //     this.setState({
  //       showModal: true,
  //       imagePreviewRerender: false
  //     });
  //   }
  // }

  // handleCropUpdate(index, cropInfo) {
  //   var newCropInfoArray = JSON.parse(JSON.stringify(this.state.cropInfo));
  //   newCropInfoArray[index] = cropInfo;
  //   this.setState({
  //     cropInfo: newCropInfoArray
  //   }, () => {
  //     console.log('crop info updated', this.state);
  //   });
  // }

  // submitCropPhotos() {
  //   this.setState({
  //     imagePreviewRerender: true
  //   }, () => {
  //     this.setState({
  //       showModal: false
  //     }, () => {
  //       this.props.handleCropInfoUpdate(this.state.cropInfo);
  //       console.log('final crop photo obj', this.state)
  //     });
  //   })
  // }

  // openModal(bool) {
  //   this.setState({
  //     showModal: bool
  //   });
  // }
          //     <ReactModal 
          //  isOpen={this.state.showModal}
          //  contentLabel="Crop Modal">
          //   <p>Please crop this image, keeping the image as focused on the person's face as possible.</p>
          //   <div>
          //     <h2>Images should be here</h2>
          //     <div>
          //       <ImagePreviewCrop 
          //         imagePreviewUrls={this.props.imagePreviewUrls}
          //         handleCropUpdate={this.handleCropUpdate.bind(this)}
          //         imagePreviewRerender={this.state.imagePreviewRerender}
          //       />
          //     </div>
          //     <button onClick={this.submitCropPhotos}>Submit cropped images</button>
          //   </div>
          // </ReactModal>

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


// <button onClick={() => this.openModal.call(this, true)}>Open Modal</button>
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

