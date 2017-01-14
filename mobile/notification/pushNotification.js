//React & Exponent
import React from 'react';
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
export default class PushNotification extends React.Component {
  componentDidMount() {
    this._notificationSubscription = this._registerForPushNotifications();
  }

  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove();
  }

  _registerForPushNotifications() {
  //   // Send our push token over to our backend so we can receive notifications
  //   // You can comment the following line out if you want to stop receiving
  //   // a notification every time you open the app. Check out the source
  //   // for this function in api/registerForPushNotificationsAsync.js
    registerForPushNotificationsAsync();

  //   // Watch for incoming notifications
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  _handleNotification = ({origin, data}) => {
    if(origin === 'received') {
      var title = Object.getOwnPropertyNames(data);
      this.props.navigator.showLocalAlert(
        title + ' : ' + data[title],
        Alerts.notice
      );
    } else {
      Store.current = data
      this.props.navigator.push(Router.getRoute('reminder', {reminder: Store.current}))
    }
  }

  render() {
    return null;
  }
}
