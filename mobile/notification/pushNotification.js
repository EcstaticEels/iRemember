//React & Exponent
import React from 'react';
import { Notifications, Permissions } from 'exponent';

// import registerForPushNotificationsAsync from './registerForPushNotificationsAsync';

//MobX
import mobx from 'mobx';

//Server connection
import axios from 'axios';
import baseUrl from '../ip.js';


var samples = [{ "id": 1, "date": "2017-01-10T13:01:00.000Z", "type": "medication", "note": "mdsfm", "recurring": false, "recurringDays": "", "notificationId": null, "registered": false, "audio": null, "title": "sdmf,", "createdAt": "2017-01-11T00:18:58.000Z", "updatedAt": "2017-01-11T00:18:58.000Z", "patientId": 1, "caregiverId": 1 }, { "id": 2, "date": "2017-01-10T13:00:00.000Z", "type": "medication", "note": "slakj", "recurring": true, "recurringDays": "Monday,Tuesday,Wednesday", "notificationId": null, "registered": null, "audio": null, "title": "shaks", "createdAt": "2017-01-11T00:19:31.000Z", "updatedAt": "2017-01-11T19:01:13.000Z", "patientId": 1, "caregiverId": 1 }, { "id": 3, "date": "2017-01-10T09:26:00.000Z", "type": "medication", "note": "CHeck recurring", "recurring": true, "recurringDays": "Monday,Tuesday,Wednesday,Thursday", "notificationId": null, "registered": false, "audio": null, "title": "Recurring Monday,Tuesday,Wednesday", "createdAt": "2017-01-11T03:07:30.000Z", "updatedAt": "2017-01-11T03:07:30.000Z", "patientId": 1, "caregiverId": 1 }];
var sample = { "id": 1, "date": "2017-01-10T13:01:00.000Z", "type": "medication", "note": "mdsfm", "recurring": true, "recurringDays": "Monday,Tuesday", "notificationId": null, "registered": false, "audio": null, "title": "sdmf,", "createdAt": "2017-01-11T00:18:58.000Z", "updatedAt": "2017-01-11T00:18:58.000Z", "patientId": 1, "caregiverId": 1 }

@observer
export default class PushNotification extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

    this._notificationSubscription = this._registerForPushNotifications();
  }

  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove();
  }

  

  _registerForPushNotifications() {
    // Send our push token over to our backend so we can receive notifications
    // You can comment the following line out if you want to stop receiving
    // a notification every time you open the app. Check out the source
    // for this function in api/registerForPushNotificationsAsync.js
    this.allowPushNotification();
    var that = this;

    // Watch for incoming notifications
    this._notificationSubscription = Notifications.addListener(that._handleNotification.bind(that));
  }

  _handleNotification ({origin, data}) {
    console.log(origin, data)
    if(origin === 'received') {
      // var message = data.title;
      // if(data.note) {
      //   message += ' : ' + data.note;
      // }
      this.props.showPushNotification(data);
    } else {
      var selectedReminder = Store.reminders.find((reminder) => {
        return reminder.id === data[0];
      })
      console.log('selected', data, selectedReminder)
      // Store.filter()
      this.props._goToReminder(selectedReminder);
    }
  }

      // const {reminders, change} = Store;
    // change('reminders', 'bye');
    // var that = this;
    // this.getTs
    // if(!this.state.notificationToken) this.allowPushNotification();
// <<<<<<< HEAD
//     this.cancelDeletedReminders();
//     this.getReminders();
    // setInterval(that.getTime(), 10000);
// =======
    // console.log('getting here?')
    // this.getReminders();
    // console.log(this.props.navigator)
    // setInterval(() => {that.polling()}, 10000);
// >>>>>>> upstream/master
  }

  // componentWillMount() {
    // Exponent.Notifications.cancelAllScheduledNotificationsAsync()
    // registerForPushNotificationsAsync();

    // Handle notifications that are received or selected while the app
    // is open
    // this._notificationSubscription = DeviceEventEmitter.addListener(
    //   'Exponent.Notification', this._handleNotification
    // );

    // Handle notifications that are received or selected while the app
    // is closed, and selected in order to open the app
    // if (this.props.exp.notification) {
    //   this._handleNotification(this.props.exp.notification);
    // }

    // _handleNotification = (notification) => {
    //   console.log('notification!!', notification)
    // };
  // };

  // showPushNotification(data){
  //   this.props.navigator.showLocalAlert(data, Alerts.notice);
  // }

  // _goToReminder = (reminder) => {
  //   console.log('current', Store.current,'reminder', reminder)
  //   Store.current = reminder;
  //   this.props.navigator.push(Router.getRoute('reminder'))
  // }

  allowPushNotification() {
    Exponent.Permissions.askAsync(Exponent.Permissions.REMOTE_NOTIFICATIONS)
    .then((response) => {
      if (response.status === "granted") {
        Exponent.Notifications.getExponentPushTokenAsync()
        .then((token) => {
          this.setState({
            notificationToken: token
          });

          axios.post(baseUrl + '/mobile/pushNotification', {
            token:  token,
            id: 1,
          })
            .then(function (response) {
              // console.log(response);
            })
            .catch(function (error) {
              // console.log(error);
            });
        })
      } else {
        console.log('Permission NOT GRANTED');
      }
    })
  }

  // allowPushNotification() {
  //   Exponent.Permissions.askAsync(Exponent.Permissions.REMOTE_NOTIFICATIONS)
  //   .then((response) => {
  //     // console.log(response);
  //     if (response.status === "granted") {
  //       Exponent.Notifications.getExponentPushTokenAsync()
  //       .then((token) => {
  //         axios.post('http://10.6.19.25:3000/mobile/pushNotification', {
  //           token:  token,
  //           username: 'Bob'
  //         })
  //           .then(function (response) {
  //             console.log(response);
  //           })
  //           .catch(function (error) {
  //             console.log(error);
  //           });

  //       })
  //     } else {
  //       console.log('Permission NOT GRANTED');
  //     }
  //   });
  // }

  // polling() {
  //   this.time();
  //   this.getReminders();
  // }
  render() {
    return null;
  }
}
