import React from 'react';

import ReminderList from './webReminderList.js';
import ReminderForm from './webReminderForm.js';

class Reminder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      month: "Select Month",
      day: "What day",
      year: "What year"
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

  render() {
    return (
      <div className="reminder">
        
        <ReminderForm month={this.state.month} getInput={this.getInput.bind(this)}/>
        {/*Another nav (tabs)*/}
      </div>
    )
  }
}

// <ReminderList getInput={this.getInput.bind(this)}/>

module.exports = Reminder;