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
  @observable id = 1;
  @observable name = 'Bob';
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

  // @action cancelNotifications(notificationId) {
  //   if (!notificationId) {
  //     return;
  //   }
  //   notificationId.forEach(notificationid => {
  //     if (notificationid) {
  //       Notifications.cancelScheduledNotificationAsync(notificationid);
  //     }
  //   })
  // }

  // cancelDeletedReminders(reminders) {
  //   var deleted = [];
  //   Store.reminders = reminders.map((reminder) => {
  //     if(reminder.registered === null) {
  //       reminder.notificationId.forEach(notificationid => {
  //         if (notificationid) {
  //           Notifications.cancelScheduledNotificationAsync(notificationid);
  //         }
  //       })
  //       that.cancelNotifications(reminder.notificationId)
  //       deleted.push(reminder.id);
  //     } else {
  //       return reminder
  //     }
  //   })

  //   //If any notifications are cancelled, delete them from the database
  //   if (deleted.length !== 0) {
  //     axios.delete(baseUrl + '/mobile/reminders', {data: {id: deleted}})
  //     .then((success) => {
  //       console.log('deleteded?', deleted)
  //       // console.log('deleted');
  //     })
  //     .catch((error) => {
  //       console.log('error', error)
  //     })
  //   }
  // }

  // //Used by registerLocalNotification
  // setLocalNotification(reminder, localNotification, schedulingOptions, cb) {
  //   console.log('scheduled', mobx.toJS(reminder))
  //   // Notifications.presentLocalNotificationAsync(localNotification)
  //   // console.log('scheduledTime', schedulingOptions.time)
  //   Notifications.scheduleLocalNotificationAsync(localNotification, schedulingOptions)
  //     .then(newNotificationId => {
  //       // console.log('exponent notification scheduled')
  //       // console.log('reminder', reminder, 'localNotification', localNotification, 'schedulingOptions', schedulingOptions)
  //       if (!reminder.notificationId) {
  //         reminder.notificationId = [];
  //       }
  //       reminder.notificationId.push(newNotificationId);
  //       if(!reminder.registered) reminder.registered = true;
  //       cb(reminder);
  //     })
  //     .catch(function(error) {
  //       console.log('cannot add the reminder' + error);
  //       reject(error);
  //     });
  // }

  // //Use setLocalNotification
  // registerLocalNotification(reminder) {
  //   var that = this;
  //   var reminderId = reminder.id || 0;
  //   return new Promise((resolve, reject) => {
  //     if (!reminder || reminder.registered) {
  //         resolve(false);}
  //     // } else {
  //       var localNotification = {
  //         title: reminder.title,
  //         body: reminder.note || ' ',
  //         data: [reminderId, reminder.title, reminder.note],
  //         ios: {
  //           sound: true
  //         }
  //       }

  //       //cancel all LocalNotifications already associated with this reminder
  //       that.cancelNotifications(reminder.notificationId);
  //       var time = new Date(reminder.date);
  //       console.log('reminder date', reminder.date)

  //       if (reminder.recurring) {
  //         var recurringDays = mobx.toJS(reminder.recurringDays);
  //         var count = 0;
  //         recurringDays.forEach((day, ind) => {
  //           if (!day) {
  //             return;
  //           }
  //           // var differenceInMilliseconds = Store.getDifferenceInDays(day, time) * 24 * 60 * 60 * 1000;
  //           var schedulingOptions = {
  //             time: time,
  //             // time.getTime() + differenceInMilliseconds,
  //             repeat: 'day'
  //           }
  //           that.setLocalNotification(reminder, localNotification, schedulingOptions, (reminder) => {
  //             count++;
  //             if (count === recurringDays.length) {
  //               resolve(reminder);
  //             }
  //           });
  //         });
  //       } else {
  //         var schedulingOptions = {
  //           time: time
  //           // time.getTime()
  //         }
  //         that.setLocalNotification(reminder, localNotification, schedulingOptions, (reminder) => {
  //           resolve(reminder);
  //         });
  //       }
  //     // }
  //   })
  // }

  // registerMultipleLocalNotifications(reminders) {
  //   var that = this;
  //   // var promisifiedregisterLocalNotifications = reminders.map(reminder => {
  //   //   if (reminder.registered === false) {
  //   //     if (reminder) {
  //   //       // return Promise.promisify(that.registerLocalNotification(reminder))
  //   //       return that.registerLocalNotification(reminder).bind(that);
  //   //     }
  //   //   }
  //   // })

  //   // Promise.all(promisifiedregisterLocalNotifications)
  //   Promise.map(reminders, (reminder) => {
  //   // Promise.map awaits for returned promises as well.
  //     return that.registerLocalNotification(reminder);
  //   })
  //   .then(updatedReminders => {
  //     return updatedReminders.filter(updatedReminder => {
  //       return updatedReminder ? true : false;
  //     })
  //   })
  //   .then(filteredReminders => {
  //     return filteredReminders.map(filteredReminder => {
  //       return mobx.toJS(filteredReminder);
  //     })
  //   })
  //   .then(reminders => {
  //     //if any new notification is registered update database
  //     if (reminders.length > 0) {
  //       axios.put(baseUrl + '/mobile/reminders', reminders)
  //         .then(response => {
  //           console.log(response);
  //         })
  //         .catch(error => {
  //           console.log(error);
  //         });
  //     }
  //   })
  //   .catch(error => {
  //     console.log('error in promise.all', error);
  //   })
  // }

  // cancelDeletedReminders(reminders) {
  //   var deleted = [];
  //   if (!reminders) {
  //     return;
  //   }
  //   var that = this;
  //   reminders = reminders.map((reminder) => {
  //     if(reminder.registered === null) {
  //       that.cancelNotifications(reminder.notificationId);
  //       deleted.push(reminder.id);
  //     } else {
  //       return reminders
  //     }
  //   })
  //   if (deleted.length !== 0) {
  //     axios.delete(baseUrl + '/mobile/reminders', {data: {id: deleted}})
  //     .then((success) => {
  //       console.log('deleted', deleted);
  //     })
  //     .catch((error) => {
  //       console.log('error', error)
  //     })
  //   }
  // }

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