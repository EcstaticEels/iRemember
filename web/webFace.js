import React from 'react';
import $ from 'jquery';
import {Button, Row, Col, Grid} from 'react-bootstrap';

import FaceList from './webFaceList.js';
import FaceCurrent from './webFaceCurrent.js';
import FaceForm from './webFaceForm.js';

class Face extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [{subjectName:"", photos:[{photo: ''}], description:""}],
      current: {subjectName:"", photos:[{}], description:""},
      showForm: false,
      editMode: false,
      subjectName: '',
      photos: [{}],
      description: '',
      updatePhotos: '',
      updateAudio: '',
      audio: ''
    };
  }

  getFaces(func) {
    $.ajax({
      method: 'GET',
      url: '/web/identify' + '?caregiverId=1',
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
          console.log('mounted', this.state);
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
        audio: ''
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
    this.setState(obj);
  }

  getAudio(event){
    this.setState({
      updateAudio: event.target.files
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
      audio: current.audio
    });
    this.displayForm(true, true);
  }

  getPhotos(event){
    this.setState({
      updatePhotos: event.target.files
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
      });
    });
  }

  vaildForm() {
    if(this.state.subjectName.length < 3){
      console.log('name')
      return false;
    }
    if(!this.state.editMode && this.state.updatePhotos.length < 1) {
      console.log('photo')
      return false;
    }
    return true;
  }

  submitForm(event) {
    var vaild = this.vaildForm();
    if(!vaild){
      return window.alert("Invaild Form");
    }
    event.preventDefault();
    var that = this;
    var formData = new FormData();
    formData.append('id', this.props.id);
    formData.append('name', this.props.name);
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

    $.ajax({
      url: '/web/identify',
      method: this.state.editMode ? 'PUT' : 'POST',
      data: formData,
      processData: false, // tells jQuery not to process data
      contentType: false, // tells jQuery not to set contentType
      success: function (res) {
        console.log('success', res);
        if (that.state.editMode) {
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
      },
      error: function (err) {
        console.log('error', err);
      }
    });
  }

  render() {
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
              updateCurrent={this.updateCurrent.bind(this)}/>
          </div>
        </Col>
        <Col xs={12} md={8}>
          <div>
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
                description={this.state.description}/> 
              : <FaceCurrent
                  current={this.state.current}
                  edit={this.edit.bind(this)} />
          }
          </div>
        </Col>
      </Row>
    </Grid>
    )
  }
}

module.exports = Face;