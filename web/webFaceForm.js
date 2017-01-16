import React from 'react';
import {Button, Row, Col, Grid} from 'react-bootstrap';
import ImagesUpload from './webImagesUpload.js';
import AudioUpload from './webAudioUpload.js';
import ReactModal from 'react-modal';
import ImagePreview from './webImagePreviewCrop';
import ReactAudioPlayer from 'react-audio-player';


export default class FaceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPreviewModal: false 
    }
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    // this.submitCropPhotos = this.submitCropPhotos.bind(this);
  } 

  componentWillReceiveProps(nextProps) { //need to remember to del final crop info if discarded changes
    console.log(nextProps);
    if (nextProps.imagePreviewUrls.length > 0 && nextProps.fieldBeingEdited === 'photos') {
      this.setState({
        showPreviewModal: true
      });
    }
  }

  // handleCropUpdate(index, cropInfo) {
    // var newCropInfoArray = JSON.parse(JSON.stringify(this.state.cropInfo));
    // newCropInfoArray[index] = cropInfo;
    // this.setState({
    //   cropInfo: newCropInfoArray
    // }, () => {
    //   console.log('crop info updated', this.state);
    // });
  // }

  // submitCropPhotos() {
  //   this.setState({
  //     imagePreviewRerender: true
  //   }, () => {
  //     this.setState({
  //       showPreviewModal: false
  //     }, () => {
  //       this.props.handleCropInfoUpdate(this.state.cropInfo);
  //       console.log('final crop photo obj', this.state)
  //     });
  //   })
  // }

  handleOpenModal () {
    this.setState({ showPreviewModal: true });
  }
  
  handleCloseModal () {
    this.setState({ showPreviewModal: false });
  }
 

  openModal(bool) {
    this.setState({
      showPreviewModal: bool
    });
  }

  render() {
    var cloudinaryUrls = this.props.photos.map(function(photoObj) {
      return photoObj.photo;
    });
    var thumbnailPhotos = this.props.handleCloudinaryUrl(cloudinaryUrls, '134', '94', 'thumb');
    var uploadedPhotos = this.props.editMode ?       
      (<label>Current Uploaded Photos:
        <div>
        {thumbnailPhotos.length > 0 ? thumbnailPhotos.map((val, ind) => <img src={val} key={ind} />) : null}
        </div>
        <br />
      </label>) : null;
    var audioView = this.props.audio ? <ReactAudioPlayer src={this.props.audio} /> : <h4>No audio set for this face</h4>;
    var uploadedAudio = this.props.editMode ? 
      (<label>Current Uploaded Audio Reminder:
        <br />
        {audioView}
        <br />
      </label>) : null;


// <button onClick={() => this.openModal(true)}>Update default or delete face photos</button>


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
            <ReactModal 
             isOpen={this.state.showPreviewModal}
             contentLabel="Preview Modal">
              <h2>Image Preview</h2>
              <div>
                <p>Don't worry, photos will be automatically resized and rotated! To discard photos, proceed back to the previous form and select new photos.</p>
                <div>
                  {this.props.imagePreviewUrls.length > 0 ? this.props.imagePreviewUrls.map((imagePreview, ind) => <img src={imagePreview} key={ind} className='preview-images'/>) : <h1>hi</h1>} 
                </div>
              </div>
              <button onClick={this.handleCloseModal}>Close Modal</button>
            </ReactModal>

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
            <Button bsSize='small' className="btn-submit" onClick={this.props.submitForm}>Submit</Button>
          </form>
        </div>
      </Grid>
    );
  }
}

