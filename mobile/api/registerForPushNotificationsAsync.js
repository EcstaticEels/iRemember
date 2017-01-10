import {
  Platform,
} from 'react-native';
import {
  Permissions,
  Notifications,
} from 'exponent';

// Example server, implemented in Rails: https://git.io/vKHKv

import ipAdress from '../ip.js';

var baseUrl = 'http://' + ipAdress;

export default async function registerForPushNotificationsAsync() {
  // Android remote notification permissions are granted during the app
  // install, so this will only ask on iOS
  let { status } = await Permissions.askAsync(Permissions.REMOTE_NOTIFICATIONS);

  // Stop here if the user did not grant permissions
  if (status !== 'granted') {
    return;
  }

  // Get the token that uniquely identifies this device
  let token = await Notifications.getExponentPushTokenAsync();

  // POST the token to our backend so we can use it to send pushes from there
  return fetch(baseUrl + '/mobile/pushNotification', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: token,
      id: 1
    }),
  });
}
