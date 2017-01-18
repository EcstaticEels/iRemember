//React & Exponent
import React from 'react';
import {
  Platform,
  StyleSheet,
  View,
  NativeModules,
  StatusBar
} from 'react-native';
import {
  Permissions,
  Notifications,
  ImagePicker, 
  TouchID
} from 'exponent';
import {
  StackNavigation,
  TabNavigation,
  TabNavigationItem,
} from '@exponent/ex-navigation';
import {
  FontAwesome,
} from '@exponent/vector-icons';
import Router from './Router.js';
import Colors from '../constants/Colors';
import Alerts from '../constants/Alerts';

//MobX
import mobx from 'mobx';
import { observer } from 'mobx-react/native';
import Store from '../store.js'


import registerForPushNotificationsAsync from '../notification/registerForPushNotificationsAsync';

//Server connection
import axios from 'axios';
import baseUrl from '../ip.js';

import Promise from 'bluebird';

@observer
export default class RootNavigation extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      authenticated: false,
      name: '',
      id: '',
      loading: false,
      fingerprint: false
    }

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleTextSubmit = this.handleTextSubmit.bind(this);
    this.authFunction = this.authFunction.bind(this);

  }

  componentWillMount () {
    StatusBar.setHidden(true);
    this._notificationSubscription = this._registerForPushNotifications();
  }

  componentDidMount() {
    //Testing
    // var getReminders = Store.getReminders();
    // getReminders.then((reminder)=> {
    //   Notifications.scheduleLocalNotificationAsync({title: 'title', body: 'body'}, {
    //     time: (new Date()).getTime() + 3000
    //   })
    //     .then(newNotificationId => {
    //       console.log('exponent notification scheduled')
    //       // console.log('reminder', reminder, 'localNotification', localNotification, 'schedulingOptions', schedulingOptions)
    //     })
    // })

    this.setUpReminders();
  }

  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove();
  }

  setUpReminders () {
    console.log('getReminders?')
    var getReminders = Store.getReminders();
    getReminders.then((reminders)=> {
      this.cancelDeletedReminders(Store.reminders);
      this.registerMultipleLocalNotifications(Store.reminders);
    })
  }

  _registerForPushNotifications() {
    // Send our push token over to our backend so we can receive notifications
    // You can comment the following line out if you want to stop receiving
    // a notification every time you open the app. Check out the source
    // for this function in api/registerForPushNotificationsAsync.js
    this.allowPushNotification();

    // Watch for incoming notifications
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  _handleNotification = ({origin, data, remote}) => {
    console.log('origin', origin, 'data', data, 'remote', remote)
    if (origin === 'received' && remote) {

    //Testing
    // var getReminders = Store.getReminders();
    //   getReminders.then((reminders)=> {
    //     Notifications.scheduleLocalNotificationAsync({title: 'title', body: 'body'}, {
    //       time: (new Date()).getTime() + 3000
    //     })
    //       .then(newNotificationId => {
    //         console.log('exponent notification scheduled')
    //         // console.log('reminder', reminder, 'localNotification', localNotification, 'schedulingOptions', schedulingOptions)
    //       })
    //   })

      this.setUpReminders();
    } else if(origin === 'received' && !remote) {
      var message = data[1];
      if(data[2]) message += ':' + data[2];
      this.props.navigator.showLocalAlert(message, Alerts.notice);
    } else if(origin === 'selected' && !remote){
      var selectedReminder = Store.reminders.find((reminder) => {
        return reminder.id === data[0];
      })
      Store.current = selectedReminder;
      this.props.navigator.push(Router.getRoute('reminder'));
    } else {
      this.setUpReminders();
    }
  }

  allowPushNotification() {
    Permissions.askAsync(Permissions.REMOTE_NOTIFICATIONS)
    .then((response) => {
      if (response.status === "granted") {
        Notifications.getExponentPushTokenAsync()
        .then((token) => {
          console.log(token)
          axios.post(baseUrl + '/mobile/pushNotification', {
            token:  token,
            id: Store.id,
          })
            .then(function (response) {
              console.log(response);
            })
            .catch(function (error) {
              console.log(error);
            });
        })
      } else {
        console.log('Permission NOT GRANTED');
      }
    })
  }


  uploadImageAsync(uri) {
    let date = Date.now();
    let apiUrl = `${baseUrl}/mobile/login?date=${date}`

    let uriParts = uri.split('.');
    let fileType = uriParts[uri.length - 1];

    let formData = new FormData();
    formData.append('picture', {
      uri: uri,
      name: date + '.jpeg',
      type: 'image/jpeg',
    });

    let options = {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      patientName: this.state.name
    };

    return fetch(apiUrl, options);
  }

  handleTextChange (text) {
    this.setState({name: text});
  }

  _failedLogin() {
    this.props.navigator.push(Router.getRoute('failedLogin'))
  }

  handleTextSubmit () {
    ImagePicker.launchCameraAsync()
    .then((photo) => {
      this.uploadImageAsync(photo.uri)
      .then((person) => {
        return person.json()
        .then((person) => {
          if (person.name === this.state.name) {
            this.setState({authenticated: true})
          } else {
            this._failedLogin()
          }
        })
        .catch((err) => {
          console.log('BRO WE CANT AUTHENTICATE U')
          console.log('ERROR', err)
          this._failedLogin()
        })
      })
    })
  }  

  authFunction () {
    NativeModules.ExponentFingerprint.authenticateAsync('Show me your finger!')
    .then((result) => {
      if (result.success) {
        this.setState({fingerprint: true})
      } else {
        alert('Try again!');
      }
    })
  }

  render() {

    // if (!this.state.fingerprint || !this.state.authenticated) {
    //   return (
    //     <StackNavigation
    //       initialRoute={Router.getRoute('login', {authFunction: this.authFunction, state:this.state, handleTextChange: this.handleTextChange, handleTextSubmit: this.handleTextSubmit})}/>
    //       // initialRoute='login' />
    //   )
    // } else {
      return (
        <TabNavigation
          // tabBarColor='#9EBDFF'
          tabBarColor='#eeeeee'
          id="main"
          navigatorUID="main"
          tabBarHeight={150}
          initialTab="home">
          <TabNavigationItem
            id="home"
            style={styles.tabItem}
            renderIcon={isSelected => this._renderIcon('home', isSelected)}>
            <StackNavigation initialRoute={Router.getRoute('home', {state: this.state})}/>
          </TabNavigationItem>
          <TabNavigationItem
            id="reminders"
            style={styles.tabItem}
            renderIcon={isSelected => this._renderIcon('bell', isSelected)}>
            <StackNavigation initialRoute={Router.getRoute('reminders', {state: this.state})}/>
          </TabNavigationItem>

          <TabNavigationItem
            id="photos"
            style={styles.tabItem}
            renderIcon={isSelected => this._renderIcon('camera', isSelected)}>
            <StackNavigation initialRoute={Router.getRoute('photos', {state: this.state})}/>
          </TabNavigationItem>
        </TabNavigation>
      );

    // }
  }

  _renderIcon(name, isSelected) {
    return (
      <FontAwesome
        name={name}
        size={80}
        color={isSelected ? Colors.tabIconSelected : '#777'}
        style={styles.tabItem}
        selectedStyle={styles.tabItem} 
      />
    );
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
    console.log('deleting deleted reminders');
    var deleted = [];
    var that = this;
    Store.reminders = reminders.map((reminder) => {
      if(reminder.registered === null) {
        // reminder.notificationId.forEach(notificationid => {
        //   if (notificationid) {
        //     Notifications.cancelScheduledNotificationAsync(notificationid);
        //   }
        // })
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
        console.log('deleteded?', deleted);
      })
      .catch((error) => {
        console.log('error', error)
      })
    }
  }

  //Used by registerLocalNotification
  setLocalNotification(reminder, localNotification, schedulingOptions, cb) {
    console.log('scheduled', schedulingOptions)

    //Testing
      // var year = reminder.date.slice(0, 4);
      // var month = reminder.date.slice(5, 7) - 1;
      // var day = reminder.date.slice(8, 10);
      // var hour = reminder.date.slice(11, 13);
      // var minute = reminder.date.slice(14, 16);

      // var schedulingOptions = {
      //   time: (new Date(year, month, day, hour, minute)).getTime()
      // }

    // Notifications.presentLocalNotificationAsync(localNotification)
    // console.log('scheduledTime', schedulingOptions.time)
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
    console.log('why??')
    return new Promise((resolve, reject) => {
      console.log('reminder', reminder)
      if (!reminder || reminder.registered) {
          resolve(false);
      } else {
        console.log('how about here/')
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
        console.log('reminder date', reminder.date)

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
            time: time
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  selectedTab: {
    color: Colors.tabIconSelected,
    borderLeftWidth: 1,
    borderLeftColor: '#777'
  },
  tabItem: {
    borderRightWidth: 1,
    borderRightColor: '#777'
  }
});
