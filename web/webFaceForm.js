import React from 'react';
import {Button, Row, Col, Grid} from 'react-bootstrap';
import ImagesUpload from './webImagesUpload.js';
import AudioUpload from './webAudioUpload.js';
import ReactModal from 'react-modal';
import ImagePreview from './webImagePreviewCrop';
import ReactAudioPlayer from 'react-audio-player';
import ImagePreviewEntry from './webImagePreviewEntry.js';
import $ from 'jquery';

export default class FaceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPreviewModal: false,
      detectArr: [],
      itemsToSplice: []
    }
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.detectFaces = this.detectFaces.bind(this);
  } 

  componentWillReceiveProps(nextProps) { //need to remember to del final crop info if discarded changes
    if (nextProps.imagePreviewUrls.length > 0 && nextProps.fieldBeingEdited === 'photos' && this.state.itemsToSplice.length === 0) {
      this.setState({
        showPreviewModal: true
      });
      this.detectFaces(nextProps);
    } else if (nextProps.imagePreviewUrls.length > 0 && nextProps.fieldBeingEdited === 'photos' && this.state.itemsToSplice.length > 0) {
      this.setState({
        itemsToSplice: []
      });
    }
  }

  detectFaces(nextProps) {
    var formData = new FormData();
    for (var key in nextProps.updatePhotos) {
      formData.append('detectPhoto', nextProps.updatePhotos[key]);
    }
    $.ajax({
      url: '/web/detect',
      method: 'POST',
      data: formData,
      processData: false, // tells jQuery not to process data
      contentType: false, // tells jQuery not to set contentType
      success: function (res) {
        var parsedDetectResults = JSON.parse(res);
        this.setState({
          detectArr: parsedDetectResults
        }, () => {
          var spliceArray = [];
          this.state.detectArr.forEach(function(item, index) {
            if (item !== true) {
              spliceArray.push(index);
            }
          });
          this.setState({
            itemsToSplice: spliceArray
          }, () => {
            console.log('set splicing arr', this.state.itemsToSplice)
          });
        })
      }.bind(this),
      error: function (err) {
        console.log('error', err);
      }
    });
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
    this.setState({ showPreviewModal: false, detectArr: []  }, () => {
      if (this.state.itemsToSplice.length > 0) {
        this.props.removePhotos(this.state.itemsToSplice);
      }
    });
  }

  // openModal(bool) {
  //   this.setState({
  //     showPreviewModal: bool
  //   });
  // }

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
            <label>Upload image:
              <ImagesUpload getPhotos={this.props.getPhotos} numFiles={this.props.updatePhotos.length}/>
              <br />
            </label>
          </Row>
          <Row className="show-grid">

            <ReactModal 
             isOpen={this.state.showPreviewModal}
             contentLabel="Preview Modal">
              <h2>Image Preview</h2>
              <div>
                
                <p>Images submitted for each subject here will be used to train our application to recognize each subject's face. Please verify that each submitted image:</p>
                  <ul>
                    <li>depicts only the subject's face, keeping in mind that photos, televisions, or mirrors in frame may also display faces</li>
                    <li>represents the subject as closely as possible as he or she appears today</li>
                  </ul>
                <p>
                  Frontal and near-frontal face images yield ideal results with face identification. To improve the accuracy of our application's face 
                  recognition function, please avoid images in dim light or images in which the subject's face is obscured (eg. by clothing, headwear, the environment, 
                  or face position). 
                </p>
                  <br />
                <p>
                  Photos that do not contain exactly one face will be removed and accepted photos will be automatically resized and rotated. 
                  To discard photos, proceed back to the previous form and select new photos.
                </p>

                <div>
                  {this.props.imagePreviewUrls.length > 0 ? 
                    this.props.imagePreviewUrls.map((imagePreview, ind) => {
                      return (<ImagePreviewEntry photo={imagePreview} index={ind} key={ind} success={this.state.detectArr[ind]} />);
                    }) 
                    : <h1>No Image Preview Urls</h1>
                  } 
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

