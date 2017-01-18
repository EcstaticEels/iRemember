import React from 'react';
import $ from 'jquery';
import {Button, Row, Col, Grid} from 'react-bootstrap';

import FaceList from './webFaceList.js';
import FaceCurrent from './webFaceCurrent.js';
import FaceForm from './webFaceForm.js';
import Loader from 'react-loader-advanced';


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
      spliced: false
    };
  }

  detectFaces() {
    console.log('we are detecting faces');
    var formData = new FormData();
    for (var key in this.state.updatePhotos) {
      formData.append('detectPhoto', this.state.updatePhotos[key]);
    }
    $.ajax({
      url: '/web/detect',
      method: 'POST',
      data: formData,
      processData: false, // tells jQuery not to process data
      contentType: false, // tells jQuery not to set contentType
      success: function (res) {
        var parsedDetectResults = JSON.parse(res);
        var spliceArray = [];
        parsedDetectResults.forEach(function(item, index) {
          if (item !== true) {
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
      url: '/web/identify',
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
      url: '/web/identify',
      success: function(res) {
        var faces = JSON.parse(res).faces;
        func(faces);
      }.bind(this),
      error: function(err) {
        console.log('error', err);
      }
    });
  }

  componentDidMount() {
    this.getFaces((faces) => {
      if (faces.length > 0) {
        this.setState({list: faces, current: faces[0]}, () => {
          console.log('mounted webFace', this.state);
        });
      } else {
        this.setState({
          list: [],
          current: {subjectName:"", photos:[], description:"", audio: ""}
        });
      }
    });
  }

  // handleCropInfoUpdate(cropObj) {
  //   this.setState({
  //     finalCropInfo: cropObj
  //   }, () => {
  //     console.log('after crop, state:', this.state)
  //   });
  // }

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
    var key = event.target.getAttribute('class');
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
    this.displayForm(true, true);
  }

  getPhotos(e){
    e.preventDefault();
    e.persist();

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

    Array.prototype.forEach.call(e.target.files, function(file, index) {
        // Read this file, remember it in `data` using the same index
        // as the file entry
        var fr = new FileReader();
        fr.onload = function() {
          data[index] = fr.result;
          --pending;
          if (pending == 0) {
            updateTest(e.target.files, data)
          }
        }
        fr.readAsDataURL(file);
        ++pending;
    });
  }


  // getPhotoCrops(cropObj) {
  //   this.setState({
  //     updatePhotosInfo: cropObj
  //   }, () => {
  //     console.log(this.state.updatePhotosInfo);
  //   });
  // }

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

  validForm() {
    if(this.state.subjectName.length < 3){
      return false;
    }
    if(!this.state.editMode && this.state.updatePhotos.length < 1) {
      return false;
    }
    return true;
  }

  submitForm(event) {
    event.preventDefault();
    this.setState({
      loader: true
    });
    var valid = this.validForm();
    if (!valid){
      return window.alert("Invalid Form");
    }
    var formData = new FormData();
    formData.append('subjectName', this.state.subjectName);
    formData.append('description', this.state.description);
    if (this.state.editMode) {
      formData.append('faceId', this.state.current.dbId);
    } 
    for (var key in this.state.updatePhotos) {
      formData.append('photo', this.state.updatePhotos[key]);
    }
    for (var key in this.state.updateAudio) {
      formData.append('audio', this.state.updateAudio[key]);
    }
    var that = this;
    $.ajax({
      url: '/web/identify',
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
        that.editModeSwitch(false);
        that.displayForm(false, false);
        that.setState({
          loader: false
        });
      },
      error: function (err) {
        console.log('error', err);
      }
    });
  }


  render() {
    const spinner = <span><img src={'/default.svg'} /></span>
    return (
    <Grid>
      <Row className="show-grid">
        <Col xs={12} md={4}>
          <div className="face">
            <div>
            {
              this.state.showForm ? null :  
                <Button bsSize="large" className="btn-addNew" bsStyle="primary" onClick={ () => this.displayForm.call(this, true, false)}>Add New Face</Button>
            }
            </div>
            <FaceList 
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
    </Grid>
    )
  }
}

module.exports = Face;