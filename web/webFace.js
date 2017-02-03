import React from 'react';
import $ from 'jquery';
import {Button, Row, Col, Grid} from 'react-bootstrap';
import {browserHistory} from 'react-router';

import FaceList from './webFaceList.js';
import FaceCurrent from './webFaceCurrent.js';
import FaceForm from './webFaceForm.js';
import Loader from 'react-loader-advanced';

import {observer} from 'mobx-react';
import {faceForm} from './webMobxStore';

@observer
class Face extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      current: {subjectName:"", photos:[{}], description:""},
      showForm: false,
      editMode: false,
      subjectName: '',
      photos: [{}],
      description: '',
      updatePhotos: [],
      imagePreviewUrls: [],
      updateAudio: '',
      audio: '',
      loader: false,
      fieldBeingEdited: '',
      detectArr: [],
      itemsToSplice: [],
      spliced: false,
      errorText: ''
    };
  }

  detectFaces() {
    console.log('we are detecting faces');
    var formData = new FormData();
    for (var key in this.state.updatePhotos) {
      formData.append('detectPhoto', this.state.updatePhotos[key]);
    }
    if (this.state.editMode) {
      formData.append('faceId', this.state.current.dbId);
    } 
    $.ajax({
      url: '/web/faces/detect',
      method: 'POST',
      data: formData,
      processData: false, // tells jQuery not to process data
      contentType: false, // tells jQuery not to set contentType
      success: function (res) {
        var parsedDetectResults = JSON.parse(res);
        var spliceArray = [];
        parsedDetectResults.forEach(function(item, index) {
          if (!(item[0] === true && (item[1] === undefined || item[1] === "found_match")) || item[0] !== true) {
            console.log(item[0] === true, item[1] === "found_match")
            spliceArray.push(index);
          } 
        })
        this.setState({
          detectArr: parsedDetectResults,
          itemsToSplice: spliceArray
        }, () => {
          console.log('finished detectFaces and splicing calcs', this.state)
        });
      }.bind(this),
      error: function (err) {
        console.log('error', err);
        browserHistory.push('/500');
      }
    });
  }

  delete() {
    this.setState({
      loader: true
    });
    var that = this;
    $.ajax({
      method: 'DELETE',
      url: '/web/faces',
      data: JSON.stringify({faceId: this.state.current.dbId}),
      contentType: 'application/json',
      success: function(res) {
        that.setState({
          loader: false
        }, () => {
          that.componentDidMount();
        });
      },
      error: function(err) {
        console.log('error', err);
        browserHistory.push('/500');
      }
    })
  }

  removePhotos() {
    var arrayStateCopy = Array.prototype.slice.call(this.state.updatePhotos);
    var splicedCount=0;
    this.state.itemsToSplice.forEach(function(index) {
      arrayStateCopy.splice(index - splicedCount, 1);
      splicedCount++;
    });
    this.setState({
      updatePhotos: arrayStateCopy,
      spliced: true
    }, () => {
      console.log('new update photo list', this.state.updatePhotos)
    });
  }

  handleCloudinaryUrl(urlArray, w, h, type) {
    var newCloudinaryUrlArray = [];
    for (var i = 0; i < urlArray.length; i++) {
      var newUrl = urlArray[i].slice(0, 49) + `w_${w},h_${h},c_${type},g_face/a_auto_right/` + urlArray[i].slice(49);
      newCloudinaryUrlArray.push(newUrl);
    }
    return newCloudinaryUrlArray;
  }

  getFaces(func) {
    $.ajax({
      method: 'GET',
      url: '/web/faces',
      success: function(res) {
        var faces = JSON.parse(res).faces;
        func(faces);
      }.bind(this),
      error: function(err) {
        console.log('error', err);
        browserHistory.push('/500');
      }
    });
  }

  componentDidMount() {
    this.getFaces((faces) => {
      if (faces.length > 0) {
        this.setState({list: faces, current: faces[0]}, () => {
          console.log('mounted webFace', JSON.stringify(this.state.list));
        });
      } else {
        this.setState({
          list: [],
          current: {subjectName:"", photos:[], description:"", audio: ""}
        });
      }
    });
  }

  displayForm(bool, editMode) {
    if (editMode) {
      this.setState({
        showForm: bool
      });
    } else {
      this.setState({
        showForm: bool,
        subjectName: '',
        photos: [],
        description: '',
        updatePhotos: '',
        updateAudio: '',
        audio: '',
        imagePreviewUrls: [],
        fieldBeingEdited: '',
        spliced: false,
        detectArr: [],
        itemsToSplice: []
      });
    }
  }

  updateCurrent(current) {
    this.setState({
      current: current,
      showForm: false
    });
  }

  getInput(event) {
    var key = event.target.getAttribute('id');
    var value = event.target.value;
    var obj = {};
    obj[key] = value;
    obj['fieldBeingEdited'] = key;
    this.setState(obj);
  }

  getAudio(event){
    this.setState({
      updateAudio: event.target.files,
      fieldBeingEdited: 'audio'
    });
  }

  editModeSwitch(bool) {
    this.setState({
      editMode: bool
    });
  }

  edit(current) {
    this.editModeSwitch(true);
    this.setState({
      subjectName: current.subjectName,
      photos: current.photos,
      description: current.description,
      audio: current.audio, 
      updatePhotos: '',
      updateAudio: '',
      imagePreviewUrls: '',
      fieldBeingEdited: '',
      detectArr: [],
      itemsToSplice: [],
      spliced: false
    });
    faceForm.audioUrl = current.audio;
    this.displayForm(true, true);
  }

  getPhotos(e){
    if (e.target) {
      var files = e.target.files;
      e.preventDefault();
      e.persist();
    } else {
      var files = e;
    }

    var data = [];      // The results
    var pending = 0;    // How many outstanding operations we have

    var updateTest = function(files, data) {
      this.setState({
        updatePhotos: files,
        imagePreviewUrls: data,
        fieldBeingEdited: 'photos',
        detectArr: [],
        itemsToSplice: [],
        spliced: false
      }, () => {
        console.log('update preview', this.state)
      });
    }
    updateTest = updateTest.bind(this)

    Array.prototype.forEach.call(files, function(file, index) {
        // Read this file, remember it in `data` using the same index
        // as the file entry
        var fr = new FileReader();
        fr.onload = function() {
          data[index] = fr.result;
          --pending;
          if (pending == 0) {
            updateTest(files, data)
          }
        }
        fr.readAsDataURL(file);
        ++pending;
    });
  }

  handleUpdate() {
    var updatedId = this.state.current.dbId;
    var current;
    this.getFaces(faces => {
      for (var i = 0; i < faces.length; i++) {
        if (faces[i].dbId === updatedId) {
          current = faces[i];
        }
      }
      this.setState({
        list: faces,
        current: current
      }, () => {
        console.log('state after update to check the clearing', this.state)
      });
    });
  }

  submitForm(event) {
    event.preventDefault();
    this.setState({
      loader: true
    });
    var formData = new FormData();
    formData.append('subjectName', this.state.subjectName);
    formData.append('description', this.state.description);
    if (this.state.editMode) {
      formData.append('faceId', this.state.current.dbId);
    } 
    for (var key in this.state.updatePhotos) {
      formData.append('photo', this.state.updatePhotos[key]);
    }
    formData.append('audio', faceForm.audioFile);
    var that = this;
    $.ajax({
      url: '/web/faces',
      method: this.state.editMode ? 'PUT' : 'POST',
      data: formData,
      processData: false, // tells jQuery not to process data
      contentType: false, // tells jQuery not to set contentType
      success: function (res) {
        if (that.state.editMode) { //if we are editing information for a face
          that.handleUpdate();
        } else {
          var createdId = JSON.parse(res).id;
          var current;
          that.getFaces(faces => {
            for (var i = 0; i < faces.length; i++) {
              if (faces[i].dbId === createdId) {
                current = faces[i];
              }
            }
            that.setState({
              list: faces,
              current: current
            });
          });
        }
        faceForm.audioFile = null;
        faceForm.audioUrl = null;
        that.editModeSwitch(false);
        that.displayForm(false, false);
        that.setState({
          loader: false
        });
      },
      error: function (err) {
        console.log('error', err);
        browserHistory.push('/500');
      }
    });
  }

  render() {
    const spinner = <span><img src={'/default.svg'} /></span>
    return (
      <div>
        <Row className="show-grid">
          <Col xs={6} md={4}>
            <div className="face">
              <div>
              {
                this.state.showForm ? null :  

                  <div className="list-group-item new-face-btn hvr-trim" onClick={ () => this.displayForm.call(this, true, false)}>
                    <h2>Add a New Face</h2>
                  </div>
              }
              </div>
              <FaceList 
                showForm={this.state.showForm}
                list={this.state.list}
                getInput={this.getInput.bind(this)}
                updateCurrent={this.updateCurrent.bind(this)}
                handleCloudinaryUrl={this.handleCloudinaryUrl.bind(this)}
              />
            </div>
          </Col>
          <Col xs={12} md={8}>
            <div>
            <Loader show={this.state.loader} message={spinner} foregroundStyle={{color: 'white'}} backgroundStyle={{backgroundColor: 'white'}} className="spinner">
              {
                this.state.showForm ? 
                  <FaceForm 
                    getInput={this.getInput.bind(this)} 
                    getPhotos={this.getPhotos.bind(this)}
                    submitForm={this.submitForm.bind(this)}
                    editMode={this.state.editMode}
                    getAudio={this.getAudio.bind(this)}
                    audio={this.state.audio}
                    subjectName={this.state.subjectName}
                    photos={this.state.photos} 
                    description={this.state.description}
                    updatePhotos={this.state.updatePhotos}
                    imagePreviewUrls={this.state.imagePreviewUrls}
                    handleCloudinaryUrl={this.handleCloudinaryUrl.bind(this)}
                    fieldBeingEdited={this.state.fieldBeingEdited}
                    removePhotos={this.removePhotos.bind(this)}
                    detectFaces={this.detectFaces.bind(this)}
                    spliced={this.state.spliced}
                    itemsToSplice={this.state.itemsToSplice}
                    detectArr={this.state.detectArr}
                    errorText={this.state.errorText}
                  /> 
                  : <FaceCurrent
                      current={this.state.current}
                      edit={this.edit.bind(this)} 
                      handleCloudinaryUrl={this.handleCloudinaryUrl.bind(this)}
                      delete={this.delete.bind(this)}
                    />
              }
            </Loader>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

module.exports = Face;