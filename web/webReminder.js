import React from 'react';
import $ from 'jquery';
import {Button, Grid, Row, Col} from 'react-bootstrap';

import ReminderList from './webReminderList.js';
import ReminderCurrent from './webReminderCurrent.js';
import ReminderForm from './webReminderForm.js';

class Reminder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [{time: "", recurring: false, type: undefined, note: "", audio: ''}],
      current: {time: "", recurring: false, type: '', audio: "", note: "", title: ''},
      showForm: false,
      editMode: false,
      date: '',
      type: '',
      recurring: false,
      note: '',
      img: '',
      title: '',
      updateAudio: '',
      audio: ''
    };
  }

  getReminders(func) {
    var mapIcons = (type) => {
      if (type === 'medication') {
        return '/pill_logo1.jpg';
      } else if (type === 'appointment') {
        return '/appointment_logo3.jpg';
      } else {
        return '/reminder_logo.jpg';
      }
    }

    $.ajax({
      method: 'GET',
      url: '/web/reminders' + '?caregiverId=1',
      success: function(res) {
        var reminders = JSON.parse(res).reminders;
        reminders.forEach(function(reminder) {
          reminder.date = reminder.date.slice(0, 16);
          reminder.img = mapIcons(reminder.type);
          return reminder;
        });
        func(reminders);
      }.bind(this),
      error: function(err) {
        console.log('error', err);
      }
    });
  }

  componentDidMount() {
    this.getReminders((reminders) => {
      if (reminders.length > 0) {
        this.setState({
          list: reminders,
          current: reminders[0]
        }, () => {
          console.log(this.state)
        })
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
    }, () => {
      console.log('current is now', current)
    });
  }

  handleUpdate() {
    var updatedId = this.state.current.id;
    var current;
    this.getReminders((reminders) => {
      for (var i = 0; i < reminders.length; i++) {
        if (reminders[i].id === updatedId) {
          current = reminders[i];
        }
      }
      this.setState({
        list: reminders,
        current: current
      });
    });
  }

  getAudio(event){
    this.setState({
      updateAudio: event.target.files
    }, function() {
      console.log(this.state)
    });
  }

  getInput(event) {
    var key = event.target.getAttribute('class');
    var value = event.target.value;
    var obj = {};
    obj[key] = value;
    this.setState(obj, () => {
      console.log(this.state)
    });
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
    });
  }

  edit() {
    var current = this.state.current;
    this.editModeSwitch(true);
    this.setState({
      date: current.date,
      recurring: current.recurring,
      type: current.type,
      note: current.note,
      reminderId: current.id,
      img: current.img, 
      title: current.title,
      audio: current.audio
    });
    this.displayForm(true);
  }

  delete() {
    var that = this;
    $.ajax({
      method: 'DELETE',
      url: '/web/reminders',
      data: JSON.stringify({reminderId: this.state.current.id}),
      contentType: 'application/json',
      success: function(res) {
        console.log('success', res);
        that.componentDidMount();
      },
      error: function(err) {
        console.log('error', err);
      }
    })
  }

  submitForm(event) {
    event.preventDefault();
    var that = this;
    var formData = new FormData();
    formData.append('id', this.props.id);
    formData.append('name', this.props.name);
    formData.append('date', this.state.date);
    formData.append('recurring', this.state.recurring);
    formData.append('type', this.state.type);
    formData.append('note', this.state.note);
    formData.append('title', this.state.title);
    if (this.state.editMode) {
      formData.append('reminderId', this.state.reminderId);
    }
    for (var key in this.state.updateAudio) {
      formData.append('file', this.state.updateAudio[key]);
    }

    $.ajax({
      method: this.state.editMode ? 'PUT': 'POST',
      url: '/web/reminders',
      data: formData,
      processData: false,
      contentType: false,
      success: function(res) {
        if (that.state.editMode) {
          that.handleUpdate();
        } else {
          var createdId = JSON.parse(res).id;
          var current;
          that.getReminders((reminders) => {
            for (var i = 0; i < reminders.length; i++) {
              if (reminders[i].id === createdId) {
                current = reminders[i];
              }
            }
            that.setState({
              list: reminders,
              current: current
            });
          });
        }
        that.editModeSwitch(false);
        that.displayForm(false);
      },
      error: function(err) {
        console.log('error', err);
      }
    });
  }

  render() {
    return (
      <Grid>
        <Row className="show-grid">
          <Col xs={12} md={4}>
            <div className="reminder">
              <div>
                {this.state.showForm? null : 
                  <Button bsSize="large" className="btn-addNew" bsStyle="primary" onClick={() => this.displayForm.call(this, true)}>Add New Reminder</Button>}
              </div>
              <ReminderList list={this.state.list} getInput={this.getInput.bind(this)} updateCurrent={this.updateCurrent.bind(this)}/>
            </div>
          </Col>
          <Col xs={12} md={8}>
            <div>
            {
              this.state.showForm ? 
                <ReminderForm 
                  getInput={this.getInput.bind(this)} 
                  getBoolean={this.getBoolean.bind(this)}
                  getAudio={this.getAudio.bind(this)}
                  submitForm={this.submitForm.bind(this)}
                  editMode={this.state.editMode}
                  date={this.state.date}
                  type={this.state.type}
                  title={this.state.title}
                  recurring={this.state.recurring} 
                  img={this.state.img} 
                  note={this.state.note}
                  audio={this.state.audio}
                /> 
                : <ReminderCurrent current={this.state.current} edit={this.edit.bind(this)} delete={this.delete.bind(this)} />
            }
            </div>
          </Col>
        </Row>
      </Grid>
    )
  }
}

module.exports = Reminder;