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

import ipAdress from '../ip.js';

var baseUrl = 'http://' + ipAdress;

// import registerForPushNotificationsAsync from 'registerForPushNotificationsAsync';

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
    var that = this;
    this.time();
    this.weather();
    if(!this.state.notificationToken) this.allowPushNotification();
    console.log('getting here?')
    this.getReminders();
    console.log(this.props.navigator)
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

  pushNotification() {  
    const registerReminders = reminder => {
      return new Promise((resolve, reject) => {
        if (!reminder.registered) {
          console.log('this reminder', reminder.registered)
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

          var schedulingOptions = {
            time: (new Date(year, month, day, hour, minute)).getTime()
          }
          if (reminder.recurring) {
            schedulingOptions.repeat = 'day';
          }
          if (reminder.notificationId) {
            Exponent.Notifications.cancelScheduledNotificationAsync(reminder.notificationId)
          }
          Exponent.Notifications.scheduleLocalNotificationAsync(localNotification, schedulingOptions)
          .then((notificationId) => {
            console.log('exponent notification scheduled')
            reminder.notificationId = notificationId;
            reminder.registered = true;
            console.log(reminder);
            resolve(reminder);
          })
          .catch(function(error) {
            console.log('cannot add the reminder' + error);
            reject(error);
          });
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
        that.props.updateReminders(reminders);
        that.setState({
          reminders: reminders
        })
      })
      .then(() => {
        that.pushNotification();
      })
      .catch(function (error) {
      //   console.log('error', error);
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
