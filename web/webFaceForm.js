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

import MSR from 'msr';

import {observer} from 'mobx-react';
import {faceForm} from './webMobxStore';

export default class FaceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPreviewModal: false,
      loader: false,
      recording: false,
      recorded: false,
      upload: false
    }
    this.handleCloseModal = this.handleCloseModal.bind(this);
  } 

  onDrop(files) {
    console.log('Received files: ', files);
    this.setState({
      files: files
    });
  }

  onOpenClick() {
    this.refs.dropzone.open();
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

  getAudio(event) {
    faceForm.audioFile = event.target.files[0];
    var url = URL.createObjectURL(event.target.files[0]);
    faceForm.audioUrl = url;
    this.setState({
      recorded: true
    })
  }

  captureUserMedia(mediaConstraints, successCallback, errorCallback) {
    mediaConstraints = {
      audio: true
    }
    navigator.mediaDevices.getUserMedia(mediaConstraints).then(successCallback).catch(errorCallback);
    console.log('captureUserMedia THIS:', this);
  }

  startRecording() {
    // $('#start-recording').disabled = true;
    // audiosContainer = document.getElementById('audios-container');
    // console.log('startRecording()');
    var that = this;
    this.setState({
      recording: true
    })
    this.captureUserMedia(this.mediaConstraints, this.onMediaSuccess.bind(that), this.onMediaError);
  };

  stopRecording() {
    var mediaRecorder = window.mediaRecorder;
    this.setState({
      recording: false
    })
    // $('#stop-recording').disabled = true;
    mediaRecorder.stop();
    mediaRecorder.stream.stop();
    // $('.start-recording').disabled = false;
  };

  // mediaRecorder = this.store.mediaRecorder;

  onMediaSuccess(stream) {
    window.mediaRecorder = new MSR(stream);
    var mediaRecorder = window.mediaRecorder;
    mediaRecorder.stream = stream;
    mediaRecorder.mimeType = 'audio/wav';
    mediaRecorder.audioChannels = 1;
    mediaRecorder.sampleRate = 44100;
    console.log('before mediaRecorder THIS: ', this);
    mediaRecorder.ondataavailable = function(blob) {
      // $('#record-audio').html("<audio controls=''><source src=" + URL.createObjectURL(blob) + "></source></audio>");

      // var url = (window.URL || window.webkitURL).createObjectURL(blob);
      var tempFileName = Date.now().toString() + '.wav';

      // var link = document.getElementById("save");
      // link.href = url;
      // link.download = tempFileName;

      // link.download = filename || 'output.wav';
      // console.log('onMediaSuccess THIS:', this);

      // var file =
      // url.lastModifiedDate = new Date();
      // url.name = link.download;
      // this.onDrop(blob);

      var file = new File([blob], tempFileName);
      faceForm.audioFile = file;
      var blobUrl = URL.createObjectURL(blob);
      faceForm.audioUrl = blobUrl;
      this.setState({
        recorded: true
      })
    }.bind(this);

    var timeInterval = 360 * 1000;

    mediaRecorder.start(timeInterval);

    // $('#stop-recording').disabled = false;
  }
  onMediaError(e) {
    console.error('media error', e);
  }

  validateName() {
    return this.props.subjectName.length > 0 ? 'success': 'error';
  }

  validatePhotos () {
    return this.props.photos.length >= 3 ? 'success' : 'error';
  }

  showUpload() {
    this.setState({
      upload: !this.state.upload
    })
  }

  audioPart() {
    if(this.state.recording) {
      return(
        <div><Button className="pause-button" onClick={this.stopRecording.bind(this)}>
          <i className="fa fa-pause"></i>STOP</Button>
          <i className="fa fa-circle text-danger Blink"></i>LIVE</div>)
    } else if(this.state.upload) {
      return (
        <div className="audio-uploading">
        <Row>
          <Button className="record-button" onClick={this.startRecording.bind(this)}>
            <i className="fa fa-circle text-danger"></i> Record</Button>
          <Button className="upload-button" onClick={this.showUpload.bind(this)}>Upload</Button>
        </Row>
        <div className="recorded-audio-box">
          <AudioUpload getAudio={this.getAudio.bind(this)}/></div>
        </div>
      )
    } else {
      return (<Row>
        <Button className="record-button" onClick={this.startRecording.bind(this)}>
          <i className="fa fa-circle text-danger"></i> Record</Button>
        <Button className="upload-button" onClick={this.showUpload.bind(this)}>Upload</Button>
      </Row>)
    }
  }
  
  handleCloseModal () {
    this.setState({ showPreviewModal: false }, () => {
      if (this.props.itemsToSplice.length > 0) {
        this.props.removePhotos();
      }
    });
  }

  // getDescriptionValidationState () {
  //   if (this.props.description.length === 0) {
  //     return 'warning'
  //   } else {
  //     return 'success'
  //   }
  // }

  // getAudioValidationState () {
  //   if (this.props.audio) {
  //     return 'success'
  //   } else {
  //     return 'warning'
  //   }
  // }

  render() {
    if (this.props.errorText === 'Name is a required field') {
      var nameError = this.props.errorText;
    }

    var cloudinaryUrls = this.props.photos.map(function(photoObj) {
      return photoObj.photo;
    });
    var thumbnailPhotos = this.props.handleCloudinaryUrl(cloudinaryUrls, '134', '94', 'thumb');
    var uploadedPhotos = this.props.editMode ?       
      (<label>
        <div>
        {thumbnailPhotos.length > 0 ? thumbnailPhotos.map((val, ind) => {
          if(ind % 5 === 0) {
            return <img src={val} key={ind} className="preview-img front" />
          } else {
            return <img src={val} key={ind} className="preview-img" />
          }
        }) : null}
        </div>
      </label>) : null;
    var audioView = this.props.audio ? <ReactAudioPlayer src={this.props.audio} /> : <h4>No audio set for this face</h4>;
    var uploadedAudio = this.props.editMode ? 
      (<label>Current Uploaded Audio Face:
        <br />
        {audioView}
        <br />
      </label>) : null;
    const spinner = <span><img src={'/ring.svg'} /></span>



    return (
    <div className="face-form">
    <h3>New Face</h3>
        <br/>

        <FormGroup validationState={this.validateName()}>
          <ControlLabel> {'Name'} </ControlLabel>
          <FormControl 
            type="text" value={this.props.subjectName} 
            id='subjectName' placeholder='Name' 
            onChange={this.props.getInput} />
        </FormGroup>


        <FormGroup>
          <ControlLabel> {'Description'} </ControlLabel>
          <FormControl
            type="text" value={this.props.description} 
            id='description' placeholder='Description' 
            onChange={this.props.getInput} />
        </FormGroup> 

        <FormGroup>{
          this.props.editMode ? <div><ControlLabel>{'Image:'}</ControlLabel><Row className="show-grid">{uploadedPhotos}</Row></div> : null
        }</FormGroup>

        <FormGroup validationState={this.validatePhotos()}>
          <ImagesUpload getPhotos={this.props.getPhotos} numFiles={this.props.updatePhotos.length}/>
        </FormGroup>

        <ControlLabel> {'Audio Message'} </ControlLabel>
        <FormGroup>{this.audioPart()}</FormGroup>

        <FormGroup>{
          this.state.recorded || (this.props.editMode && faceForm.audioUrl)? 
          <audio src={faceForm.audioUrl} controls></audio> : null
        }</FormGroup>
        
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

      <Button bsSize='small' className="btn-submit" onClick={this.props.submitForm}>Submit</Button>

    </div>
    );
  }
}

       // <Row className="show-grid">
       //      {uploadedPhotos}
       //    </Row>

// <FormGroup validationState={this.getAudioValidationState()} >
//             <ControlLabel> {'Upload Audio Message:'} </ControlLabel>
//             <AudioUpload getPhotos={this.props.getAudio} />
//           </FormGroup>