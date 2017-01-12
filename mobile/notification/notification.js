//React & Exponent
import React from 'react';
import {View} from 'react-native';
import {Notifications} from 'exponent';
import Alerts from '../constants/Alerts';

import registerForPushNotificationsAsync from './registerForPushNotificationsAsync';

//MobX
import {observer} from 'mobx-react/native';
import Store from '../store.js'

//Server connection
import axios from 'axios';
import baseUrl from '../ip.js';

export default class NotificationComponent extends React.Component {
  constructor (props) {
    super(props)

  }

  // componentDidMount() {
  //   this._notificationSubscription = this._registerForPushNotifications();
  // }

  // componentWillUnmount() {
  //   this._notificationSubscription && this._notificationSubscription.remove();
  // }

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

  render(){
    return null;
  }
}

