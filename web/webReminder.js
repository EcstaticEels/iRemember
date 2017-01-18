import React from 'react';
import $ from 'jquery';
import {Button, Grid, Row, Col} from 'react-bootstrap';

import ReminderList from './webReminderList.js';
import ReminderCurrent from './webReminderCurrent.js';
import ReminderForm from './webReminderForm.js';
import Loader from 'react-loader-advanced';
import Moment from 'moment';

import {observer} from 'mobx-react';
import {reminderForm} from './webMobxStore';

@observer
class Reminder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      current: {time: "", recurring: false, type: '', audio: "", note: "", title: ''},
      showForm: false,
      editMode: false,
      date: Moment().format(),
      type: 'medication',
      recurring: false,
      selectedDays: {
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false,
        Saturday: false,
        Sunday: false
      },
      note: '',
      img: '',
      title: '',
      updateAudio: '',
      audio: '',
      loader: false
    };
  }

  getReminders(func) {
    var that = this
    var mapIcons = (type) => {
      if (type === 'medication') {
        return '/pill_logo1.jpg';
      } else if (type === 'appointment') {
        return '/appointment_logo3.jpg';
      } else if (type === 'chores') {
        return '/chores.jpg'; 
      } else {
        return '/reminder_logo.jpg';
      }
    }

    $.ajax({
      method: 'GET',
      url: '/web/reminders',
      success: function(res) {
        var reminders = JSON.parse(res).reminders;
        reminders.forEach(function(reminder) {
          reminder.date = new Date(reminder.date);
          reminder.img = mapIcons(reminder.type);
          reminder.selectedDays = that.recurringDaysToObj(reminder.recurringDays);
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
          console.log('retrieved reminders from server', this.state)
        });
      } else {
        this.setState({
          list: [],
          current: {
            time: "", 
            recurring: false, 
            selectedDays: {
              Monday: false,
              Tuesday: false,
              Wednesday: false,
              Thursday: false,
              Friday: false,
              Saturday: false,
              Sunday: false
            }, 
            type: '', 
            audio: '', 
            note: '', 
            title: ''}
        });
      }
    });
  }

  handleDateChange(date) {
    console.log('date', date)
    this.setState({
      date: date
    }, () => {
      console.log('date change', this.state.date)
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
        date: '',
        type: 'medication',
        recurring: false,
        note: '',
        img: '',
        title: '',
        updateAudio: '',
        audio: ''
      });
    }
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

  getSelectedDay(event){
    var selectedDays = this.state.selectedDays;
    var key = event.target.getAttribute('id');
    var value = !selectedDays[key];
    selectedDays[key] = value;
    this.setState({
      selectedDays: selectedDays
    });
  }

  selectedDaysToArray(obj) {
    var recurringDays = [];
    for(var day in obj){
      if(obj[day]){
        recurringDays.push(day);
      }
    }
    return recurringDays;
  }

  recurringDaysToObj(str) {
  if(!str) return;
    var arr = str.split(',');
    var selectedDays = {};
    var daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    daysOfWeek.forEach((day) => {
      selectedDays[day] = arr.indexOf(day) === -1 ? false : true;
    })
    return selectedDays;
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
      selectedDays: current.selectedDays,
      type: current.type,
      note: current.note,
      reminderId: current.id,
      img: current.img, 
      title: current.title
    });
    reminderForm.audioUrl = current.audio;
    this.displayForm(true, true);
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

  // validForm() {
  //   if(this.state.date.length !== 16){
  //     return false;
  //   }
  //   if(this.state.title.length < 1) {
  //     return false;
  //   }
  //    if(this.state.recurring && (!this.state.recurringDays || !this.state.recurringDays[0])) {
  //     return false;
  //   }
  //   return true;
  // }

  submitForm(event) {
    event.preventDefault();
    this.setState({
      loader: true
    });
    // var valid = this.validForm();
    // if(!valid){
    //   return window.alert("Invalid Form");
    // }
    if (this.state.recurring){
      var recurringDays = this.selectedDaysToArray(this.state.selectedDays);
      if (recurringDays.length === 0 || !recurringDays[0]) {
        this.setState({
          recurring: false
        })
      }
    }
    var that = this;
    var formData = new FormData();
    console.log('uncoverted date', this.state.date)
    var convertedMomentDate = Moment.utc(this.state.date).format()
    console.log('converted date', convertedMomentDate)
    formData.append('date', convertedMomentDate);
    formData.append('recurring', this.state.recurring);
    formData.append('recurringDays', recurringDays);
    formData.append('type', this.state.type);
    formData.append('note', this.state.note);
    formData.append('title', this.state.title);
    console.log('audio', reminderForm.audioUrl, reminderForm.audioFile)
    formData.append('registered', false);
    if (this.state.editMode) {
      formData.append('reminderId', this.state.reminderId);
    }
    formData.append('file', reminderForm.audioFile);
    $.ajax({
      method: this.state.editMode ? 'PUT': 'POST',
      url: '/web/reminders',
      data: formData,
      processData: false,
      contentType: false,
      success: function(res) {
        console.log('success', res)
        if (that.state.editMode) {
          that.handleUpdate();
        } else {
          console.log('res', res)
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
        reminderForm.audioFile = null;
        reminderForm.audioUrl = null;
        that.editModeSwitch(false);
        that.displayForm(false, false);
        console.log('loader state changed to false')
        that.setState({
          loader: false
        });
      },
      error: function(err) {
        console.log('error', err);
      }
    });
  }

  render() {
    const spinner = <span><img src={'/default.svg'} /></span>
    return (
        <Row className="show-grid">
          <Col xs={12} md={4}>
            <div className="reminder">
              <div>
                {this.state.showForm ? null : 
                  <Button bsSize="large" className="btn-addNew" bsStyle="primary" onClick={() => this.displayForm.call(this, true, false)}>Add New Reminder</Button>}
              </div>
              <ReminderList list={this.state.list} getInput={this.getInput.bind(this)} updateCurrent={this.updateCurrent.bind(this)}/>
            </div>
          </Col>
          <Col xs={12} md={8}>
            <div>
            <Loader show={this.state.loader} message={spinner} foregroundStyle={{color: 'white'}} backgroundStyle={{backgroundColor: 'white'}} className="spinner">
            {
              this.state.showForm ? 
                <ReminderForm 
                  getInput={this.getInput.bind(this)} 
                  getBoolean={this.getBoolean.bind(this)}
                  handleDateChange={this.handleDateChange.bind(this)}
                  submitForm={this.submitForm.bind(this)}
                  editMode={this.state.editMode}
                  date={this.state.date}
                  type={this.state.type}
                  title={this.state.title}
                  recurring={this.state.recurring}
                  selectedDays={this.state.selectedDays}
                  getSelectedDay={this.getSelectedDay.bind(this)} 
                  img={this.state.img} 
                  note={this.state.note}
                  audio={this.state.audio}
                /> 
                : <ReminderCurrent current={this.state.current} edit={this.edit.bind(this)} delete={this.delete.bind(this)} />
            }
            </Loader>
            </div>
          </Col>
        </Row>
    )
  }
}

module.exports = Reminder;