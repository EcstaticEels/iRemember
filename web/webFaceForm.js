import React from 'react';
import {Button, Row, Col, Grid, FormControl, FormGroup, ControlLabel} from 'react-bootstrap';
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

  getNameValidationState () {
    if (this.props.subjectName.length > 0) {
      return 'success'
    } else {
      return 'error'
    }
  }

  getImageValidationState () {
    if (this.props.photos.length >= 3) {
      return 'success'
    } else {
      return 'error'
    }
  }

  getDescriptionValidationState () {
    if (this.props.description.length === 0) {
      return 'warning'
    } else {
      return 'success'
    }
  }

  getAudioValidationState () {
    if (this.props.audio) {
      return 'success'
    } else {
      return 'warning'
    }
  }

  render() {
    if (this.props.errorText === 'Name is a required field') {
      var nameError = this.props.errorText;
    }

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
        <form>
          <FormGroup validationState={this.getNameValidationState()}>
            <ControlLabel> {'First name'} </ControlLabel>
            <FormControl type="text" value={this.props.subjectName} id='subjectName' placeholder='Name' onChange={this.props.getInput} />

          </FormGroup>

          <FormGroup validationState={this.getImageValidationState()}>
            <ControlLabel> {'Image:'} </ControlLabel>
            <ImagesUpload getPhotos={this.props.getPhotos} />
          </FormGroup>

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

          <Row className="show-grid">
            {uploadedPhotos}
          </Row>

          <FormGroup validationState={this.getAudioValidationState()} >
            <ControlLabel> {'Upload Audio Message:'} </ControlLabel>
            <AudioUpload getPhotos={this.props.getAudio} />
          </FormGroup>

        <FormGroup validationState={this.getDescriptionValidationState()}>
          <ControlLabel> {'Description'} </ControlLabel>
          <FormControl type="text" value={this.props.description} id='description' placeholder='Description' onChange={this.props.getInput} />
        </FormGroup>

        <Button bsSize='small' className="btn-submit" onClick={this.props.submitForm}>Submit</Button>

       </form> 
      </Grid>
    );
  }
}



      { /* <div className="face-form">
          <Row className="show-grid">
            <h5>New Face</h5>
          </Row>
          <form>
          <Row className="show-grid">
            <label>
              Name:
              <input type="text" value={this.props.subjectName} className="subjectName" placeholder="Name" onChange={this.props.getInput}/>
              <br/>
              <h5 className='error'>{nameError}</h5>
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
        </div> */}