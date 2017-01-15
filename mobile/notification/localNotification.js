//React & Exponent
import React from 'react';
import { Notifications } from 'exponent';

import registerForPushNotificationsAsync from './registerForPushNotificationsAsync';

//MobX
import mobx from 'mobx';
import { observer } from 'mobx-react/native';
import Store from '../store.js'

//Server connection
import axios from 'axios';
import baseUrl from '../ip.js';

import Promise from 'bluebird';


// var samples = [{ "id": 1, "date": "2017-01-10T13:01:00.000Z", "type": "medication", "note": "mdsfm", "recurring": false, "recurringDays": "", "notificationId": null, "registered": false, "audio": null, "title": "sdmf,", "createdAt": "2017-01-11T00:18:58.000Z", "updatedAt": "2017-01-11T00:18:58.000Z", "patientId": 1, "caregiverId": 1 }, { "id": 2, "date": "2017-01-10T13:00:00.000Z", "type": "medication", "note": "slakj", "recurring": true, "recurringDays": "Monday,Tuesday,Wednesday", "notificationId": null, "registered": null, "audio": null, "title": "shaks", "createdAt": "2017-01-11T00:19:31.000Z", "updatedAt": "2017-01-11T19:01:13.000Z", "patientId": 1, "caregiverId": 1 }, { "id": 3, "date": "2017-01-10T09:26:00.000Z", "type": "medication", "note": "CHeck recurring", "recurring": true, "recurringDays": "Monday,Tuesday,Wednesday,Thursday", "notificationId": null, "registered": false, "audio": null, "title": "Recurring Monday,Tuesday,Wednesday", "createdAt": "2017-01-11T03:07:30.000Z", "updatedAt": "2017-01-11T03:07:30.000Z", "patientId": 1, "caregiverId": 1 }];
// var sample = { "id": 1, "date": "2017-01-10T13:01:00.000Z", "type": "medication", "note": "mdsfm", "recurring": true, "recurringDays": "Monday,Tuesday", "notificationId": null, "registered": false, "audio": null, "title": "sdmf,", "createdAt": "2017-01-11T00:18:58.000Z", "updatedAt": "2017-01-11T00:18:58.000Z", "patientId": 1, "caregiverId": 1 }

@observer
export default class LocalNotification extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    var that = this;
    var callbacks = [this.cancelDeletedReminders.bind(this), this.registerMultipleLocalNotifications.bind(this)]
    this.getReminders(callbacks);
  }

  getReminders(callbacks) {
    axios.get(baseUrl + '/mobile/reminders', {
        params: {
          patientId: Store.id
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
        
        Store.reminders = reminders;
      })
      .then(() => {
        callbacks.forEach((cb) => {
          cb(Store.reminders);
        });
      })
      .catch(error => {
        console.log('error', error);
      });
  }

  cancelNotifications(notificationId) {
    if (!notificationId) {
      return;
    }
    notificationId.forEach(notificationid => {
      if (notificationid) {
        Notifications.cancelScheduledNotificationAsync(notificationid);
      }
    })
  }

  cancelDeletedReminders(reminders) {
    var deleted = [];
    Store.reminders = reminders.map((reminder) => {
      if(reminder.registered === null) {
        reminder.notificationId.forEach(notificationid => {
          if (notificationid) {
            Notifications.cancelScheduledNotificationAsync(notificationid);
          }
        })
        that.cancelNotifications(reminder.notificationId)
        deleted.push(reminder.id);
      } else {
        return reminder
      }
    })

    //If any notifications are cancelled, delete them from the database
    if (deleted.length !== 0) {
      axios.delete(baseUrl + '/mobile/reminders', {data: {id: deleted}})
      .then((success) => {
        console.log('deleteded?', deleted)
        // console.log('deleted');
      })
      .catch((error) => {
        console.log('error', error)
      })
    }
  }

  //Used by registerLocalNotification
  setLocalNotification(reminder, localNotification, schedulingOptions, cb) {
    console.log('scheduled', mobx.toJS(reminder))
    // Notifications.presentLocalNotificationAsync(localNotification)
    console.log('scheduledTime', new Date(schedulingOptions.time))
    Notifications.scheduleLocalNotificationAsync(localNotification, schedulingOptions)
      .then(newNotificationId => {
        // console.log('exponent notification scheduled')
        // console.log('reminder', reminder, 'localNotification', localNotification, 'schedulingOptions', schedulingOptions)
        if (!reminder.notificationId) {
          reminder.notificationId = [];
        }
        reminder.notificationId.push(newNotificationId);
        if(!reminder.registered) reminder.registered = true;
        cb(reminder);
      })
      .catch(function(error) {
        console.log('cannot add the reminder' + error);
        reject(error);
      });
  }

  //Use setLocalNotification
  registerLocalNotification(reminder) {
    var that = this;
    var reminderId = reminder.id || 0;
    return new Promise((resolve, reject) => {
      if (!reminder || reminder.registered) {
        resolve(false);
      } else {
        var localNotification = {
          title: reminder.title,
          body: reminder.note || ' ',
          data: [reminderId, reminder.title, reminder.note],
          ios: {
            sound: true
          }
        }

        //cancel all LocalNotifications already associated with this reminder
        that.cancelNotifications(reminder.notificationId);
        var time = new Date(reminder.date);

        if (reminder.recurring) {
          var recurringDays = mobx.toJS(reminder.recurringDays);
          var count = 0;
          recurringDays.forEach((day, ind) => {
            if (!day) {
              return;
            }
            var differenceInMilliseconds = Store.getDifferenceInDays(day, time) * 24 * 60 * 60 * 1000;
            var schedulingOptions = {
              time: time.getTime() + differenceInMilliseconds,
              repeat: 'day'
            }
            that.setLocalNotification(reminder, localNotification, schedulingOptions, (reminder) => {
              count++;
              if (count === recurringDays.length) {
                resolve(reminder);
              }
            });
          });
        } else {
          var schedulingOptions = {
            time: time.getTime()
          }
          that.setLocalNotification(reminder, localNotification, schedulingOptions, (reminder) => {
            resolve(reminder);
          });
        }
      }
    })
  }

  registerMultipleLocalNotifications(reminders) {
    var that = this;
    // var promisifiedregisterLocalNotifications = reminders.map(reminder => {
    //   if (reminder.registered === false) {
    //     if (reminder) {
    //       // return Promise.promisify(that.registerLocalNotification(reminder))
    //       return that.registerLocalNotification(reminder).bind(that);
    //     }
    //   }
    // })

    // Promise.all(promisifiedregisterLocalNotifications)
    Promise.map(reminders, (reminder) => {
    // Promise.map awaits for returned promises as well.
      return that.registerLocalNotification(reminder);
    })
    .then(updatedReminders => {
      return updatedReminders.filter(updatedReminder => {
        return updatedReminder ? true : false;
      })
    })
    .then(filteredReminders => {
      return filteredReminders.map(filteredReminder => {
        return mobx.toJS(filteredReminder);
      })
    })
    .then(reminders => {
      //if any new notification is registered update database
      if (reminders.length > 0) {
        axios.put(baseUrl + '/mobile/reminders', reminders)
          .then(response => {
            console.log(response);
          })
          .catch(error => {
            console.log(error);
          });
      }
    })
    .catch(error => {
      console.log('error in promise.all', error);
    })
  }

  cancelDeletedReminders(reminders) {
    var deleted = [];
    if (!reminders) {
      return;
    }
    var that = this;
    reminders = reminders.map((reminder) => {
      if(reminder.registered === null) {
        that.cancelNotifications(reminder.notificationId);
        deleted.push(reminder.id);
      } else {
        return reminders
      }
    })
    if (deleted.length !== 0) {
      axios.delete(baseUrl + '/mobile/reminders', {data: {id: deleted}})
      .then((success) => {
        console.log('deleted', deleted);
      })
      .catch((error) => {
        console.log('error', error)
      })
    }
  }

  render() {
    return null;
  }
}
