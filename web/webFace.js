import React from 'react';

import FaceList from './webFaceList.js';
import FaceCurrent from './webFaceCurrent.js';
import FaceForm from './webFaceForm.js';

class Face extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [{time: "2017-01-04T12:59", recurring: "false", type: undefined, img: "http://pngimg.com/upload/pills_PNG16521.png", note: "Take pill"}, {time: "2017-01-04T01:00", recurring: "false", type: "medication", img: "http://pngimg.com/upload/pills_PNG16521.png", note: "dksfl"}],
      current: {time: "2017-01-04T12:59", recurring: "true", type: 'appointment', img: "http://pngimg.com/upload/pills_PNG16521.png", note: "Take pill"},
      showForm: false,
      editModeOn: false,
      time: '',
      type: 'medication',
      recurring: "false",
      img: "http://pngimg.com/upload/pills_PNG16521.png",
      note: ''
    };
  }

  showForm() {
    this.setState({
      showForm: true
    })
  }

  hideForm() {
    this.setState({
      showForm: false
    })
  }

  updateCurrent(current) {
    this.setState({
      current: current
    })
  }

  getInput(event) {
    var key = event.target.getAttribute('class');
    var value = event.target.value;
    this.setState({
      note: value
    });
  }

  editModeOn() {
    this.setState({
      editMode: true
    })
  }

  editModeOff() {
    this.setState({
      editMode: false
    })
  }

  edit(current) {
    this.editModeOn();
    this.setState({
      time: current.time,
      recurring: current.recurring,
      type: current.type,
      img: current.img,
      note: current.note
    })
    this.showForm();
  }

  submitForm(event) {
    var that = this;
    var form = {};
    form.time = this.state.time;
    form.recurring = JSON.parse(this.state.recurring);
    form.type = this.state.type;
    form.img = this.state.img;
    form.note = this.state.note;
    
    $.ajax({
      method: 'POST',
      url: '/web/Faces',
      data: form,
      contentType: 'application/json',
      dataType: 'JSON',
      success: function (res) {
        console.log('success', res);
        that.editModeOff();
        that.hideForm();
        that.updateCurrent(res);
      },
      error: function (err) {
        console.log('error', err);
      }
    })

    event.preventDefault();

  }

  render() {
    return (
      <div className="face">
        <div>{
          this.state.showForm? null : <button type="button" onClick={this.showForm.bind(this)}>Add New Face</button>
        }</div>
        <FaceList list={this.state.list} getInput={this.getInput.bind(this)} updateCurrent={this.updateCurrent.bind(this)}/>
        <div>{
          this.state.showForm? 
            <FaceForm 
              getInput={this.getInput.bind(this)} 
              submitForm={this.submitForm.bind(this)}
              editMode={this.state.editMode}
              time={this.state.time}
              type={this.state.type}
              recurring={this.state.recurring} 
              img={this.state.img} 
              note={this.state.note}/> 
            : <FaceCurrent current={this.state.current} edit={this.edit.bind(this)}/>
        }</div>
      </div>
    )
  }
}

module.exports = Face;