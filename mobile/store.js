import {observable, autorun, action} from "mobx";

//Server connection
import axios from 'axios';
import baseUrl from './ip.js';

class Store {
  constructor () {
    this.update = this.update.bind(this);
    this.getReminders = this.getReminders.bind(this);
  }

  //Observable variables
  @observable name = 'John';
  @observable id = 3;
  @observable reminders = [];
  @observable current = { "id": 1, "date": "2017-01-10T13:01:00.000Z", "type": "medication", "note": "mdsfm", "recurring": true, "recurringDays": "Monday,Tuesday", "notificationId": null, "registered": false, "audio": null, "title": "sdmf,", "createdAt": "2017-01-11T00:18:58.000Z", "updatedAt": "2017-01-11T00:18:58.000Z", "patientId": 1, "caregiverId": 1 };

  //Accessible Actions

  //Change observable variable value to new value
  @action update(key, value) {
    // console.log('before', key, that[key]);
    this[key] = value;
    // console.log('after', key, that[key]);
  }

  //Reminder Actions
  @action getReminders() {
    var patientId = this.id;
    return new Promise((resolve, reject) => {
      axios.get(baseUrl + '/mobile/reminders', {
        params: {
          patientId: patientId
        }
      })
      .then(response => {
        var reminders = response.data.reminders;

        //convert string recurringDays and notificationIds to array
        //MySQL only accept string
        reminders.forEach(reminder => {
          if (reminder.recurringDays) reminder.recurringDays = reminder.recurringDays.split(',');
          if (reminder.notificationId) reminder.notificationId = reminder.notificationId.split(',');
        })
        
        this.reminders = reminders;
        resolve(reminders);
      })
      .catch(error => {
        reject(error);
      });
    })
  }

  //Change date from database to JS Date instance
  // @action convertDate (date) {
  //   var year = date.slice(0, 4);
  //   var month = date.slice(5, 7) - 1;
  //   var day = date.slice(8, 10);
  //   var hour = date.slice(11, 13);
  //   var minute = date.slice(14, 16);
  //   return new Date(year, month, day, hour, minute);
  // }

  //Get closest Date in given dayOfWeek from setTime in milliseconds;
  @action getDifferenceInDays (dayOfWeek, setTime) {
    var daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    var dayOfWeekInd = daysOfWeek.indexOf(dayOfWeek);
    var setTimeInd = setTime.getDay();
    var differenceInDays = dayOfWeekInd - setTimeInd;
    if(differenceInDays < 0) {
      differenceInDays = 7 + differenceInDays;
    }
    return differenceInDays;
  } 
}

var MobXStore = new Store();
module.exports = MobXStore;

// var person = observable({
//     // observable properties:
//     name: "John",
//     age: 42,
//     showAge: false,

//     // computed property:
//     get labelText() {
//         return this.showAge ? `${this.name} (age: ${this.age})` : this.name;
//     },

//     // action:
//     setAge: action(function() {
//         this.age = 21;
//     })
// });

// // object properties don't expose an 'observe' method,
// // but don't worry, 'mobx.autorun' is even more powerful
// autorun(() => console.log(person.labelText));

// person.name = "Dave";
// // prints: 'Dave'

// person.setAge(21);
// // etc