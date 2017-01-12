import React from 'react';

import axios from 'axios';

import {
  Button,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  DeviceEventEmitter
} from 'react-native';

import * as Exponent from 'exponent';

import { MonoText } from '../components/StyledText';

import weatherIcons from '../assets/images/weatherIcons.js';

import moment from 'moment';

import {observer} from 'mobx-react/native';
import Store from '../store.js'

import baseUrl from '../ip.js';

// import registerForPushNotificationsAsync from 'registerForPushNotificationsAsync';

@observer
export default class HomeScreen extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      weatherDescription: '', 
      weatherIcon: '',
      currentLatitude: '',
      currentLongitude: '',
      dateTime: {
        time: '',
        dayNight: ''
      },
      authenticated: false
    }
  }

  static route = {
    navigationBar: {
      visible: false,
    },
  }

  //need to render something prettier

  componentDidMount () {
    const {reminders, change} = Store;
    change('reminders', 'bye');
    var that = this;
    this.time();
    this.weather();
    if(!this.state.notificationToken) this.allowPushNotification();
    this.cancelDeletedReminders();
    this.getReminders();
    setInterval(() => {that.polling()}, 10000);
  }

  componentWillMount() {
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
  };

  cancelDeletedReminders() {
    var reminders = this.props.reminders;
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
    this.props.updatedReminders(reminders);

  }

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

  registerReminder(reminder, localNotification, schedulingOptions) {
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

  pushNotification() {  
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
            reminder = registerReminder(reminder, localNotification, schedulingOptions);
          })
          resolve(reminder);
        } else {
          resolve(false);
        }
      })
    }  
    var promisifiedregisterReminders = this.state.reminders.map(registerReminders)
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

  polling() {
    this.time();
    this.getReminders();
  }

  time() {
    var date = new Date();

    var hours = date.getHours();

    if (hours > 18) {
      var dayNight = 'night';
    } else {
      var dayNight = 'day';
    }


    this.setState({dateTime: {
      time: moment().format('LT'),
      dayNight: dayNight
    }});
  }

  weather() {
    Exponent.Permissions.askAsync(Exponent.Permissions.LOCATION)
    .then(function (response) {
      if (response.status === 'granted') {
        Exponent.Location.getCurrentPositionAsync()
        .then(function (location) {
          this.setState({
            currentLatitude: location.coords.latitude,
            currentLongitude: location.coords.longitude
          })
          var weatherUrl = 'http://api.openweathermap.org/data/2.5/weather?lat=' + this.state.currentLatitude + '&lon=' + this.state.currentLongitude + '&APPID=dbab6e66b7e766cdfaf26fd6000f06e4';
          fetch (weatherUrl)
          .then(function (response) {
            return response.json()
          })
          .then(function (responseJSON) {
            console.log(responseJSON)
            responseJSON.weather[0].description = responseJSON.weather[0].description.split('');

            responseJSON.weather[0].description[0] = responseJSON.weather[0].description[0].toUpperCase();

            responseJSON.weather[0].description = responseJSON.weather[0].description.join('');

            if (responseJSON.weather[0].main === 'Rain' || responseJSON.weather[0].main === 'Drizzle') {
              this.setState({
                weatherDescription: responseJSON.weather[0].description,
                weatherIcon: weatherIcons.rainy
              });
            }

            if (responseJSON.weather[0].main === 'Thunderstorm') {
              this.setState({
                weatherDescription: responseJSON.weather[0].description,
                weatherIcon: weatherIcons.storm
              });
            }

            if (responseJSON.weather[0].main === 'Snow') {
              this.setState({
                weatherDescription: responseJSON.weather[0].description,
                weatherIcon: weatherIcons.snow
              });
            }

            if (responseJSON.weather[0].main === 'Clear') {
              this.setState({
                weatherDescription: responseJSON.weather[0].description,
                weatherIcon: weatherIcons.sunny
              });
            }

            if (responseJSON.weather[0].id >= 700 && responseJSON.weather[0].id < 800) {
              this.setState({
                weatherDescription: responseJSON.weather[0].description,
                weatherIcon: weatherIcons.mist
              });
            }

            if (responseJSON.weather[0].description === 'Few clouds') {
              this.setState({
                weatherDescription: responseJSON.weather[0].description,
                weatherIcon: weatherIcons.partiallyCloudy
              });
            }

            if (responseJSON.weather[0].description === 'Scattered clouds' || responseJSON.weather[0].description === 'Broken clouds' || responseJSON.weather[0].description === 'Overcast clouds') {
              this.setState({
                weatherDescription: responseJSON.weather[0].description,
                weatherIcon: weatherIcons.cloudy
              });
            }
          }.bind(this))
        }.bind(this))
      } else {
        //THIS IS JANKY -- PLEASE FIX
        console.log('PLEASE ALLOW US TO USE YOUR LOCATION')
        this.setState({weatherDescription: 'PLEASE ALLOW US TO USE YOUR LOCATION'})
      }

    }.bind(this));
  }

  getReminders() {
    var that = this;
    console.log('getting reminders', baseUrl + '/mobile/reminders')
    axios.get(baseUrl + '/mobile/reminders', {
      params: {
        patientId: 1
      }
    })
      .then((response) => {
        var reminders = response.data.reminders;
        reminders.forEach((reminder) => {
          reminder.recurringDays = reminder.recurringDays.split('');
        })
        that.props.updateReminders(reminders);
        that.setState({
          reminders: reminders
        })
      })
      .then(() => {
        that.pushNotification();
      })
      .catch(function (error) {
        console.log('error', error);
      });
  }

  render() {
    // console.log(this.state)
    return (

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}>
         

          <View style={styles.homepageContentContainer}>
            <Text style={styles.timeText}>
              {this.state.dateTime.time}
            </Text>
          </View>

          <View style={styles.homepageContentContainer}>
            <Text style={styles.commentText}>
              {'WOULD LIKE TO PUT SOME SORT OF DAYLIGHT / SUNMOON SPECTRUM HERE'}
            </Text>
          </View>
          <View style={styles.homepageContentContainer}>
            <Text style={styles.dateText}>{moment().format('dddd, MMMM DD YYYY')}</Text>
          </View>

          <View style={styles.homepageContentContainer}>
            <Text style={styles.weatherText}>
              {this.state.weatherDescription}
            </Text>
            <Image style={styles.homepageContentIcon} source={{uri: "" + this.state.weatherIcon}}>
            </Image> 
          </View>

        </ScrollView>
    );
  }
}

//WOULD STILL LIKE TO RENDER DIFFERENT COLOR SCHEME BASED ON DAY VS. NIGHT

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2c3e50',
  },
  contentContainer: {
    paddingTop: 40,
    height: 300,
    flexDirection: 'column',
    justifyContent: 'space-around',
    flex: 1
  },
  homepageContentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  homepageContentIcon: {
    height: 100,
    width: 100
  },
  weatherText: {
    color: '#ECECEC',
    fontSize: 24
  },
  timeText: {
    fontSize: 60, 
    color: '#ECECEC',
  }, 
  dateText: {
    color: '#ECECEC',
    fontSize: 36,
  },
  commentText: {
    color: '#ECECEC',
    fontSize: 12
  }
});
