//React & Exponent
import React from 'react';
import { View } from 'react-native';
import { Notifications } from 'exponent';
import Alerts from '../constants/Alerts';

import registerForPushNotificationsAsync from './registerForPushNotificationsAsync';

//MobX
import mobx from 'mobx';
import { observer } from 'mobx-react/native';
import Store from '../store.js'

//Server connection
import axios from 'axios';
import baseUrl from '../ip.js';


var samples = [{ "id": 1, "date": "2017-01-10T13:01:00.000Z", "type": "medication", "note": "mdsfm", "recurring": false, "recurringDays": "", "notificationId": null, "registered": false, "audio": null, "title": "sdmf,", "createdAt": "2017-01-11T00:18:58.000Z", "updatedAt": "2017-01-11T00:18:58.000Z", "patientId": 1, "caregiverId": 1 }, { "id": 2, "date": "2017-01-10T13:00:00.000Z", "type": "medication", "note": "slakj", "recurring": true, "recurringDays": "Monday,Tuesday,Wednesday", "notificationId": null, "registered": null, "audio": null, "title": "shaks", "createdAt": "2017-01-11T00:19:31.000Z", "updatedAt": "2017-01-11T19:01:13.000Z", "patientId": 1, "caregiverId": 1 }, { "id": 3, "date": "2017-01-10T09:26:00.000Z", "type": "medication", "note": "CHeck recurring", "recurring": true, "recurringDays": "Monday,Tuesday,Wednesday,Thursday", "notificationId": null, "registered": false, "audio": null, "title": "Recurring Monday,Tuesday,Wednesday", "createdAt": "2017-01-11T03:07:30.000Z", "updatedAt": "2017-01-11T03:07:30.000Z", "patientId": 1, "caregiverId": 1 }];
var sample = { "id": 1, "date": "2017-01-10T13:01:00.000Z", "type": "medication", "note": "mdsfm", "recurring": true, "recurringDays": "Monday,Tuesday", "notificationId": null, "registered": false, "audio": null, "title": "sdmf,", "createdAt": "2017-01-11T00:18:58.000Z", "updatedAt": "2017-01-11T00:18:58.000Z", "patientId": 1, "caregiverId": 1 }

@observer
export default class NotificationComponent extends React.Component {
  constructor(props) {
    super(props)

  }

  componentDidMount() {
    this.getReminders();
    // this.cancelDeletedReminders();
    // this.registerMultipleLocalNotifications(Store.reminders);
    // console.log(reminders);
    // this.registerLocalNotification(reminders[0]);
    // this._notificationSubscription = this._registerForPushNotifications();
  }

  // componentWillUnmount() {
  //   this._notificationSubscription && this._notificationSubscription.remove();
  // }

  getReminders(callbacks) {
    axios.get(baseUrl + '/mobile/reminders', {
        params: {
          patientId: Store.id
        }
      })
      .then(response => {
        console.log(response)
        var reminders = response.data.reminders;
        console.log(JSON.stringify(reminders))

        //convert string recurringDays and notificationIds to array
        //MySQL only accept string
        reminders.forEach(reminder => {
          if (reminder.recurringDays) reminder.recurringDays = reminder.recurringDays.split(',');
          if (reminder.notificationId) reminder.notificationId = reminder.notificationId.split(',');
        })
        
        Store.reminders = reminders;
      })
      .then(() => {
        console.log(Store.reminders)
      })
      .catch(error => {
        console.log('error', error);
      });
  }

  cancelNotifications(notificationId) {
    notificationId.forEach(notificationid => {
      if (notificationid) {
        Notifications.cancelScheduledNotificationAsync(notificationid);
      }
    })
  }

  cancelDeletedReminders() {
    var deleted = [];
    Store.reminders = Store.reminders.map((reminder) => {
      if(reminder.registered === null) {
        cancelNotifications(reminder.notificationId)
        deleted.push(reminder.id);
      } else {
        return reminder
      }
    })

    //If any notifications are cancelled, delete them from the database
    if (deleted.length !== 0) {
      axios.delete(baseUrl + '/mobile/reminders', {id: deleted})
      .then((success) => {
        console.log('deleted');
      })
      .catch((error) => {
        console.log('error', error)
      })
    }
  }

  //Used by registerLocalNotification
  setLocalNotification(reminder, localNotification, schedulingOptions) {
    Notifications.scheduleLocalNotificationAsync(localNotification, schedulingOptions)
      .then(newNotificationId => {
        console.log('exponent notification scheduled')
        if (!reminder.notificationId) {
          reminder.notificationId = [];
        }
        reminder.notificationId.push(newNotificationId);
        reminder.registered = true;
        return reminder;
      })
      .catch(function(error) {
        console.log('cannot add the reminder' + error);
        reject(error);
      });
  }

  //Use setLocalNotification
  registerLocalNotification(reminder) {
    if (reminder.registered) {
      return;
    }
    var localNotification = {
      title: reminder.title,
      body: reminder.note || ' ',
      data: {
        [reminder.title]: reminder.note
      },
      ios: {
        sound: true
      }
    }

    //cancel all LocalNotifications already associated with this reminder
    if (reminder.notificationId) {
      this.cancelNotifications(reminder.notificationId);
    }

    var time = Store.convertDate(reminder.date);

    if (reminder.recurring) {
      reminder.recurringDays.forEach(day => {
        if (!day) {
          return;
        }

        var reminderTime = Store.setDayofWeekTime(day, time);
        var schedulingOptions = {
          time: reminderTime.getTime(),
          repeat: 'day'
        }
        reminder = this.setLocalNotification(reminder, localNotification, schedulingOptions);
      }).bind(this);
    } else {
      var schedulingOptions = {
        time: time.getTime()
      }
      reminder = this.setLocalNotification(reminder, localNotification, schedulingOptions)
    }

    return reminder;
  }

  registerMultipleLocalNotifications(reminders) {
    var promisifiedregisterLocalNotifications = reminders.map(reminder => {
      if (reminder.registered === false) {
        reminder = registerLocalNotification(reminder);
        if (reminder) {
          return new Promise((resolve, reject) => {
            resolve(reminder);
          })
        }
      }
    })
    Promise.all(promisifiedregisterLocalNotifications)
      .then(updatedReminders => {
        //if any new notification is registered update database
        if (updatedReminders.length > 0) {
          axios.put(baseUrl + '/mobile/reminders', updatedReminders)
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
    reminders = reminders.map((reminder) => {
      if(reminder.registered === null) {
        if(reminder.notificationId) {
          reminder.notificationId.forEach((notificationid) => {
            if(notificationid) Exponent.Notifications.cancelScheduledNotificationAsync(notificationid);
          })
        }
        deleted.push(reminder.id);
      } else {
        return reminders
      }
    })
    if (deleted.length !== 0) {
      axios.delete(baseUrl + '/mobile/reminders', {id: deleted})
      .then((success) => {
        console.log('deleted');
      })
      .catch((error) => {
        console.log('error', error)
      })
    }
    // Store.updated('reminders', reminders);
  }


  // _registerForPushNotifications() {
  // //   // Send our push token over to our backend so we can receive notifications
  // //   // You can comment the following line out if you want to stop receiving
  // //   // a notification every time you open the app. Check out the source
  // //   // for this function in api/registerForPushNotificationsAsync.js
  // //   registerForPushNotificationsAsync();

  // //   // Watch for incoming notifications
  //   this._notificationSubscription = Notifications.addListener(this._handleNotification);
  // }

  // _handleNotification = ({origin, data}) => {
  //   if(origin === 'received') {
  //     var title = Object.getOwnPropertyNames(data);
  //     this.props.navigator.showLocalAlert(
  //       title + ' : ' + data[title],
  //       Alerts.notice
  //     );
  //   } else {

  //   }
  // }

  render() {
    return null;
  }
}
