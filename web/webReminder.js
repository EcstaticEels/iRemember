import React from 'react';
import $ from 'jquery';

import ReminderList from './webReminderList.js';
import ReminderCurrent from './webReminderCurrent.js';
import ReminderForm from './webReminderForm.js';

class Reminder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [{time: "2017-01-04T12:59", recurring: false, type: undefined, img: "http://pngimg.com/upload/pills_PNG16521.png", note: "Take pill"}, {time: "2017-01-04T01:00", recurring: false, type: "medication", img: "http://pngimg.com/upload/pills_PNG16521.png", note: "dksfl"}],
      current: {time: "2017-01-04T12:59", recurring: true, type: 'appointment', img: "http://pngimg.com/upload/pills_PNG16521.png", note: "Take pill"},
      showForm: false,
      editMode: false,
      date: '',
      type: 'medication',
      recurring: false,
      img: "http://pngimg.com/upload/pills_PNG16521.png",
      note: ''
    };
  }

  componentDidMount() {
    $.ajax({
      method: 'GET',
      url: '/web/reminders' + '?caregiverId=1',
      success: function(res) {
        var reminders = JSON.parse(res).reminders;
        reminders.forEach(function(reminder) {
          reminder.date = reminder.date.slice(0, 16);
          return reminder;
        })
        this.setState({list: reminders});
      }.bind(this),
      error: function(err) {
        console.log('error', err);
      }
    })
  }

  showForm() {
    this.setState({
      showForm: true
    });
  }

  hideForm() {
    this.setState({
      showForm: false
    });
  }

  updateCurrent(current) {
    this.setState({
      current: current
    });
  }

  getInput(event) {
    var key = event.target.getAttribute('class');
    var value = event.target.value;
    var obj = {};
    obj[key] = value;
    this.setState(obj);
  }

  getBoolean(event) {
    var key = event.target.getAttribute('class');
    var value = event.target.value;
    var obj = {};
    obj[key] = JSON.parse(value);
    this.setState(obj);
  }

  editModeSwitch(bool) {
    this.setState({
      editMode: bool
    })
  }

  edit() {
    var current = this.state.current;
    this.editModeSwitch(true);
    this.setState({
      date: current.date,
      recurring: current.recurring,
      type: current.type,
      img: current.img,
      note: current.note,
      reminderId: current.id
    })
    this.showForm();
  }

  delete() {
    var that = this;
    var data = this.state.current;
    data.id = this.props.id;
    data.name = this.props.name;

    $.ajax({
      method: 'DELETE',
      url: '/web/reminders',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function(res) {
        console.log('success', res);
        that.updateCurrent(that.state.list[0]);
      },
      error: function(err) {
        console.log('error', err);
      }
    })
  }

  submitForm(event) {
    event.preventDefault();
    var that = this;
    var form = {};
    form.id = this.props.id;
    form.name = this.props.name;
    form.date = this.state.date;
    form.recurring = this.state.recurring;
    form.type = this.state.type;
    form.img = this.state.img;
    form.note = this.state.note;
    if (this.state.editMode) {
      form.reminderId = this.state.reminderId;
    }    
    $.ajax({
      method: this.state.editMode ? 'PUT': 'POST',
      url: '/web/reminders',
      data: JSON.stringify(form),
      contentType: 'application/json',
      success: function(res) {
        console.log('success', res);
        that.editModeSwitch(false);
        that.hideForm();
        that.updateCurrent(JSON.parse(res));
      },
      error: function(err) {
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
          this.state.showForm ? 
            <ReminderForm 
              getInput={this.getInput.bind(this)} 
              getBoolean={this.getBoolean.bind(this)}
              submitForm={this.submitForm.bind(this)}
              editMode={this.state.editMode}
              date={this.state.date}
              type={this.state.type}
              recurring={this.state.recurring} 
              img={this.state.img} 
              note={this.state.note}
            /> 
            : <ReminderCurrent 
              current={this.state.current} 
              edit={this.edit.bind(this)}
              delete={this.delete.bind(this)}/>
        }</div>
      </div>
    )
  }
}

module.exports = Reminder;