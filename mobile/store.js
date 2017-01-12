import {observable, autorun, action} from "mobx";

var that

class Store {
  constructor () {
    that = this;
  }

  //Observable variables
  @observable id = 1;
  @observable name = 'Bob';
  @observable reminders = [];
  @observable currentReminder = {};

  //Accessible Actions

  @action change(key, value) {
    that[key] = value;
  }

  //Reminder Actions
  @action getReminders(callback) {
    console.log('getting reminders', baseUrl + '/mobile/reminders')
    axios.get(baseUrl + '/mobile/reminders', {
      params: {
        patientId: that.id
      }
    })
      .then((response) => {
        var reminders = response.data.reminders;
        reminders.forEach((reminder) => {
          reminder.recurringDays = reminder.recurringDays.split(',');
          reminders.notificationId = reminder.notificationId.split(',');
        })
        that.reminders = reminders
      })
      .then(() => {
        callback();
      })
      .catch((error) => {
        console.log('error', error);
      });
  }

  @action registerReminder(reminder, localNotification, schedulingOptions) {
    Exponent.Notifications.scheduleLocalNotificationAsync(localNotification, schedulingOptions)
    .then((newNotificationId) => {
      console.log('exponent notification scheduled')
      if(!reminder.notificationId) {
        reminder.notificationId = [newNotificationId];
      } else {
        reminder.notificationId.push(newNotificationId);
      }
      reminder.registered = true;
      return reminder;
    })
    .catch(function(error) {
      console.log('cannot add the reminder' + error);
      reject(error);
    });
  }

  @action getPushNotification() {
    const registerReminders = reminder => {
      return new Promise((resolve, reject) => {
        if (!reminder.registered) {
          var localNotification = {
            title: reminder.title,
            body: reminder.note || ' ',
            data: {[reminder.title]: reminder.note},
            ios: {
              sound: true
            }
          }
          var year = reminder.date.slice(0, 4);
          var month = reminder.date.slice(5, 7) - 1;
          var day = reminder.date.slice(8, 10);
          var hour = reminder.date.slice(11, 13);
          var minute = reminder.date.slice(14, 16);

          var time = new Date(year, month, day, hour, minute);

          if(reminder.notificationId) {
            reminder.notificationId.forEach((notificationid) => {
              Exponent.Notifications.cancelScheduledNotificationAsync(notificationid);
            })
          }
          var daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
          var setDay = time.getDay();
          reminder.recurringDays.forEach((day) => {
            if(!day) {
              return;
            }
            var dayOfWeek = daysOfWeek.indexOf(day);
            var diffDays = daysOfWeek - setDay;
            if(diffDays < 0) {
              diffDays = 7 + diffDays;
            }
            var schedulingOptions = {
              time: (new Date(year, month, day + diffDays, hour, minute)).getTime()
            }
            if(reminder.recurring) {
              schedulingOptions.repeat = 'day';
            }
            reminder = that.registerReminder(reminder, localNotification, schedulingOptions);
          })
          resolve(reminder);
        } else {
          resolve(false);
        }
      })
    }  
    var promisifiedregisterReminders = that.reminders.map(registerReminders)
    Promise.all(promisifiedregisterReminders)
    .then(updatedReminders => {
      updatedReminders = updatedReminders.filter((reminder) => {
        return reminder; 
      })
      if(updatedReminders.length > 0) {
        axios.put(baseUrl + '/mobile/reminders', updatedReminders)
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
      }
    })
    .catch(error => {
      console.log('error in promise.all');

    })
    // Exponent.Notifications.cancelAllScheduledNotificationsAsync()
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