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
      list: [{subjectName:"test", photos:["http://pngimg.com/upload/pills_PNG16521.png", "http://pngimg.com/upload/pills_PNG16521.png", "http://pngimg.com/upload/pills_PNG16521.png"], description:"testfiles"}, {subjectName:"test1", photos:["http://pngimg.com/upload/pills_PNG16521.png", "http://pngimg.com/upload/pills_PNG16521.png"], description:"testfiles1"}],
      current: {subjectName:"test", photos:["http://pngimg.com/upload/pills_PNG16521.png", "http://pngimg.com/upload/pills_PNG16521.png", "http://pngimg.com/upload/pills_PNG16521.png"], description:"testfiles"},
      showForm: false,
      editMode: false,
      subjectName: '',
      photos: ["http://pngimg.com/upload/pills_PNG16521.png"],
      description: ''
    };
  }

  componentDidMount() {
    $.ajax({
      method: 'GET',
      url: '/web/identify' + '?caregiverId=1',
      success: function(res) {
        var faces = JSON.parse(res).faces;
        this.setState({list: faces, current: faces[0]}, () => {
          console.log('resetting face state list', this.state)
        });
      }.bind(this),
      error: function(err) {
        console.log('error', err);
      }
    });
  }

  displayForm(bool) {
    this.setState({
      showForm: bool
    });
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


  getPhotos(e){
    this.setState({
      photos: e.target.files
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
      description: current.description
    })
    this.displayForm(true);
  }

  getPhotos(event){
    this.setState({
      photos: event.target.files
    }, function() {
      console.log(this.state)
    });
  }

  submitForm(event) {
    event.preventDefault();
    var that = this;
    var formData = new FormData();
    formData.append('id', this.props.id);
    formData.append('name', this.props.name);
    formData.append('subjectName', this.state.subjectName);
    formData.append('description', this.state.description);
    for (var key in this.state.photos) {
      formData.append('file', this.state.photos[key]);
    }
    $.ajax({
      url: '/web/identify',
      method: 'POST',
      data: formData,
      processData: false, // tells jQuery not to process data
      contentType: false, // tells jQuery not to set contentType
      success: function (res) {
        console.log('success', res);
        that.editModeSwitch(false);
        that.displayForm(false);
        that.updateCurrent(res);
      },
      error: function (err) {
        console.log('error', err);
      }
    })
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
                <Button bsSize="large" className="btn-addNew" bsStyle="primary" onClick={ () => this.displayForm.call(this, true)}>Add New Face</Button>
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