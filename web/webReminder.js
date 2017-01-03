import React from 'react';

import ReminderList from './webReminderList.js';
import ReminderCurrent from './webReminderCurrent.js';
import ReminderForm from './webReminderForm.js';

class Reminder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [{time: "2017-01-04T12:59", recurring: "false", type: undefined, img: "http://pngimg.com/upload/pills_PNG16521.png", note: "Take pill"}, {time: "2017-01-04T01:00", recurring: "false", type: "medication", img: "http://pngimg.com/upload/pills_PNG16521.png", note: "dksfl"}],
      current: {time: "2017-01-04T12:59", recurring: "false", type: undefined, img: "http://pngimg.com/upload/pills_PNG16521.png", note: "Take pill"},
      showForm: false,
      time: '',
      type: 'medication',
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
    var obj = {};
    obj[key] = value;
    this.setState(obj);
    console.log(this.state[key])
  }

  edit(current){
    this.setState({
      time: current.time,
      recurring: current.recurring,
      type: current.type,
      img: current.img,
      note: current.note
    })
    this.showForm();
  }

  submitForm() {
    var that = this;
    var form = {};
    form.time = this.state.time;
    form.recurring = this.state.recurring;
    form.type = this.state.type;
    form.img = this.state.img;
    form.note = this.state.note;
    
    $.ajax({
      method: 'POST',
      url: '/web/reminders',
      data: form,
      contentType: 'application/json',
      dataType: 'JSON',
      success: function (res) {
        console.log('success', res);
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
      <div className="reminder">
        <div>{
          this.state.showForm? null : <button type="button" onClick={this.showForm.bind(this)}>Add New Reminder</button>
        }</div>
        <ReminderList list={this.state.list} getInput={this.getInput.bind(this)} updateCurrent={this.updateCurrent.bind(this)}/>
        <div>{
          this.state.showForm? 
            <ReminderForm getInput={this.getInput.bind(this)} submitForm={this.submitForm.bind(this)} time={this.state.time} type={this.state.type} img={this.state.img} note={this.state.note}/> 
            : <ReminderCurrent current={this.state.current} edit={this.edit.bind(this)}/>
        }</div>
      </div>
    )
  }
}

module.exports = Reminder;