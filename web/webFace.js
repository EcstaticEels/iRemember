import React from 'react';

import FaceList from './webFaceList.js';
import FaceCurrent from './webFaceCurrent.js';
import FaceForm from './webFaceForm.js';

class Face extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      current: {},
      showForm: false,
      editModeOn: false,
      name: '',
      photos: ["http://pngimg.com/upload/pills_PNG16521.png"]
      description: ''
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
    }
  }

  updateCurrent(current) {
    this.setState({
      current: current
    })
  }

  getInput(event) {
    var key = event.target.getAttribute('class');
    var value = event.target.value;
    var obj = {};
    obj[key] = value;
    this.setState(obj);
    console.log('why empty?', obj, this.state[key])
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
      description: current.description
    })
    this.showForm();
  }

  submitForm() {
    var that = this;
    var form = {};
    form.id = this.props.id;
    form.name = this.props.name;
    form.time = this.state.time;
    form.recurring = JSON.parse(this.state.recurring);
    form.type = this.state.type;
    form.img = this.state.img;
    form.description = this.state.description;
    
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
              description={this.state.description}/> 
            : <FaceCurrent current={this.state.current} edit={this.edit.bind(this)}/>
        }</div>
      </div>
    )
  }
}

module.exports = Face;