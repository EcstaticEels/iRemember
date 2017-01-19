import React from 'react';
import {Button, Row, Col, Grid, FormControl, FormGroup, ControlLabel} from 'react-bootstrap';
import ImagesUpload from './webImagesUpload.js';
import AudioUpload from './webAudioUpload.js';
import ReactModal from 'react-modal';
import ImagePreview from './webImagePreviewCrop';
import ReactAudioPlayer from 'react-audio-player';
import ImagePreviewEntry from './webImagePreviewEntry.js';
import $ from 'jquery';
import Loader from 'react-loader-advanced';

export default class FaceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPreviewModal: false,
      loader: false
    }
    this.handleCloseModal = this.handleCloseModal.bind(this);
  } 

  componentWillReceiveProps(nextProps) { 
    if (nextProps.spliced === false && nextProps.fieldBeingEdited === 'photos' && nextProps.imagePreviewUrls.length > 0
      && nextProps.detectArr.length > 0) {
      this.setState({
        loader: false
      })
    } else if (nextProps.spliced === false && nextProps.fieldBeingEdited === 'photos' && nextProps.imagePreviewUrls.length > 0
      && nextProps.detectArr.length === 0) {
      this.setState({
        showPreviewModal: true,
        loader: true
      });
      this.props.detectFaces();
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
  
  handleCloseModal () {
    this.setState({ showPreviewModal: false }, () => {
      if (this.props.itemsToSplice.length > 0) {
        this.props.removePhotos();
      }
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
    const spinner = <span><img src={'/ring.svg'} /></span>



    return (
    <div className="face-form">
      <Grid>
        <form>
          <FormGroup validationState={this.getNameValidationState()}>
            <ControlLabel> {'First name'} </ControlLabel>
            <FormControl type="text" value={this.props.subjectName} id='subjectName' placeholder='Name' onChange={this.props.getInput} />

          </FormGroup>

          <FormGroup validationState={this.getImageValidationState()}>
            <ControlLabel> {'Image:'} </ControlLabel>
            <ImagesUpload getPhotos={this.props.getPhotos} numFiles={this.props.updatePhotos.length}/>
          </FormGroup>

            <ReactModal 
             isOpen={this.state.showPreviewModal}
             contentLabel="Preview Modal">
              <h2>Image Preview</h2>
              <div>
                
                <p>Images submitted for each subject here will be used to train our application to recognize each subject's face. 
                  On this screen, please verify that each submitted image:</p>
                  <ul>
                    <li>depicts only the subject's face, keeping in mind that photos, artwork, televisions, or mirrors in frame may also display faces</li>
                    <li>represents the subject as closely as possible as he or she appears today</li>
                  </ul>
                <p>
                  Frontal and near-frontal face images yield ideal results with face identification. To improve the accuracy of our application's face 
                  recognition function, please avoid images in dim light or images in which the subject's face is obscured (eg. by clothing, headwear, the environment, 
                  or face position). 
                </p>
                <br />
                <p>
                  The images you selected on the previous screen will be auto-detected for faces here, and photos that do not contain exactly one face will be removed from the
                  upload queue. When creating a face profile for a new subject, a minimum of three photos must be submitted. Photos will be automatically resized and rotated. 
                  To discard photos, proceed back to the previous form and select new photos.
                </p>

                <div>
                  <Loader show={this.state.loader} message={spinner} foregroundStyle={{color: 'white'}} backgroundStyle={{backgroundColor: 'white'}} className="spinner">
                  {this.props.imagePreviewUrls.length > 0 ? 
                    this.props.imagePreviewUrls.map((imagePreview, ind) => {
                      return (<ImagePreviewEntry photo={imagePreview} index={ind} key={ind} success={this.props.detectArr[ind]} />);
                    }) 
                    : <h1>No images detected</h1>
                  } 
                  </Loader>
                </div>
              </div>
              <button onClick={this.handleCloseModal}>Close Modal</button>
            </ReactModal>

          <Row className="show-grid">
            {uploadedPhotos}
          </Row>

        <FormGroup validationState={this.getDescriptionValidationState()}>
          <ControlLabel> {'Description'} </ControlLabel>
          <FormControl type="text" value={this.props.description} id='description' placeholder='Description' onChange={this.props.getInput} />
        </FormGroup>

       </form> 

      <Button bsSize='small' className="btn-submit" onClick={this.props.submitForm}>Submit</Button>
      </Grid>
    </div>
    );
  }
}

// <FormGroup validationState={this.getAudioValidationState()} >
//             <ControlLabel> {'Upload Audio Message:'} </ControlLabel>
//             <AudioUpload getPhotos={this.props.getAudio} />
//           </FormGroup>