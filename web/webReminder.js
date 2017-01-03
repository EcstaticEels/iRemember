import React from 'react';

import ReminderList from './webReminderList.js';
import ReminderForm from './webReminderForm.js';

class Reminder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'medication'
    };
  }

  getInput(event) {
    var key = event.target.getAttribute('class');
    var value = event.target.value;
    var obj = {};
    obj[key] = value;
    this.setState(obj);
    console.log(this.state[key])
  }

  submitForm() {
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
      },
      error: function (err) {
        console.log('error', err);
      }
    })

  }

  render() {
    return (
      <div className="reminder">
        <ReminderForm month={this.state.month} getInput={this.getInput.bind(this)} submitForm={this.submitForm.bind(this)}/>
        {/*Another nav (tabs)*/}
      </div>
    )
  }
}

// <ReminderList getInput={this.getInput.bind(this)}/>

module.exports = Reminder;