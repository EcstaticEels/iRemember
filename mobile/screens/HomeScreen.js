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

import moment from 'moment'

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
        weekDay: '',
        month: '',
        monthDay: '',
        year: '',
        time: '',
        dayNight: ''
      }
    }
  }

  static route = {
    navigationBar: {
      visible: false,
    },
  }

  //need to render something prettier

  componentDidMount () {
    this.weather();
    this.getReminders()
  }

  componentWillMount() {
    // registerForPushNotificationsAsync();

    // Handle notifications that are received or selected while the app
    // is open
    this._notificationSubscription = DeviceEventEmitter.addListener(
      'Exponent.Notification', this._handleNotification
    );

    // Handle notifications that are received or selected while the app
    // is closed, and selected in order to open the app
    // if (this.props.exp.notification) {
    //   this._handleNotification(this.props.exp.notification);
    // }

    // _handleNotification = (notification) => {
    //   console.log(notification)
    //   // this.setState({notificationData: notification})
    // };
  };

  pushNotification() {
    this.state.reminders.map((reminder) => {
      if (!reminder.registered) {
        var localNotification = {
          title: reminder.title,
          body: reminder.note,
          ios: {
            sound: true
          }
        }
        var schedulingOptions = {
          time: (new Date(reminder.date.slice(-4))).getTime()
        }
        if (reminder.recurring) {
          schedulingOptions.repeat = 'day';
        }
        if (reminder.notificationId) {
          Exponent.Notifications.cancelScheduledNotificationAsync(reminder.notificationId)
        }
        Exponent.Notifications.scheduleLocalNotificationAsync(localNotification, schedulingOptions)
          .then((notificatonId) => {
            reminder.notification = notificationId;
            reminder.registered = true;
          })
          .then(() => {
            axios.put('http://10.6.21.34:3000/mobile/pushNotification', {
              reminderId: reminder.reminderId,
              registered: reminder.registered,
              notificationId: reminder.notificationId
            })
              .then(function (response) {
                console.log(response);
              })
              .catch(function (error) {
                console.log(error);
              });
          })

      }

      
    })
    // Exponent.Notifications.cancelAllScheduledNotificationsAsync()
    
    
    
  }

  allowPushNotification() {
    Exponent.Permissions.askAsync(Exponent.Permissions.REMOTE_NOTIFICATIONS)
    .then((response) => {
      // console.log(response);
      if (response.status === "granted") {
        Exponent.Notifications.getExponentPushTokenAsync()
        .then((token) => {
          axios.post('http://10.6.21.34:3000/mobile/pushNotification', {
            token:  token,
            username: 'Bob'
          })
            .then(function (response) {
              // console.log(response);
            })
            .catch(function (error) {
              // console.log(error);
            });

        })
      } else {
        // console.log('Permission NOT GRANTED');
      }
    });
  }

  weather() {

    var date = new Date();

    var weekday = new Array(7);
    weekday[0] =  "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    var weekDay = weekday[date.getDay()];

    var monthArr = new Array(12);
    monthArr[0] = "January";
    monthArr[1] = "February";
    monthArr[2] = "March";
    monthArr[3] = "April";
    monthArr[4] = "May";
    monthArr[5] = "June";
    monthArr[6] = "July";
    monthArr[7] = "August";
    monthArr[8] = "September";
    monthArr[9] = "October";
    monthArr[10] = "November";
    monthArr[11] = "December";
    var month = monthArr[date.getMonth()];

    var monthDay = date.getDate();

    var year = date.getFullYear();

    var hours = date.getHours();

    var minutes = date.getMinutes();

    if (hours > 18) {
      var dayNight = 'night';
    } else {
      var dayNight = 'day';
    }

    if (minutes < 10) {
      minutes = '0' + minutes;
    }

    if (hours > 12) {
      minutes += ' P.M.';
      hours -= 12;
    } else {
      minutes += ' A.M.'
    }


    this.setState({dateTime: {
      weekDay: weekDay,
      month: month,
      monthDay: monthDay,
      year: year,
      time: hours + ':' + minutes,
      dayNight: dayNight
    }});


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
            console.log(responseJSON.weather[0].main)

            responseJSON.weather[0].description = responseJSON.weather[0].description.split('');

            responseJSON.weather[0].description[0] = responseJSON.weather[0].description[0].toUpperCase();

            responseJSON.weather[0].description = responseJSON.weather[0].description.join('');

            if (responseJSON.weather[0].main === 'Rain' || responseJSON.weather[0].main === 'Drizzle') {
              this.setState({
                weatherDescription: responseJSON.weather[0].description,
                weatherIcon: weatherIcons.rainy
              })
            }

            if (responseJSON.weather[0].main === 'Thunderstorm') {
              this.setState({
                weatherDescription: responseJSON.weather[0].description,
                weatherIcon: weatherIcons.storm
              })
            }

            if (responseJSON.weather[0].main === 'Snow') {
              this.setState({
                weatherDescription: responseJSON.weather[0].description,
                weatherIcon: weatherIcons.snow
              })
            }

            if (responseJSON.weather[0].main === 'Clear') {
              this.setState({
                weatherDescription: responseJSON.weather[0].description,
                weatherIcon: weatherIcons.sunny
              })
            }

            if (responseJSON.weather[0].main === 'Atmosphere' || responseJSON.weather[0].main === 'Mist') {
              this.setState({
                weatherDescription: responseJSON.weather[0].description,
                weatherIcon: weatherIcons.mist
              })
            }

            if (responseJSON.weather[0].description === 'Few clouds') {
              this.setState({
                weatherDescription: responseJSON.weather[0].description,
                weatherIcon: weatherIcons.partiallyCloudy
              })
            }

            if (responseJSON.weather[0].description === 'Scattered clouds' || responseJSON.weather[0].description === 'Broken clouds' || responseJSON.weather[0].description === 'Overcast clouds') {
              this.setState({
                weatherDescription: responseJSON.weather[0].description,
                weatherIcon: weatherIcons.cloudy
              })
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
    axios.get('http://10.6.21.34:3000/mobile/reminders', {
      params: {
        id: 1
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
    console.log(this.state)
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
            <Text style={styles.dateText}>
              {this.state.dateTime.weekDay + ', ' + this.state.dateTime.month + ' ' + this.state.dateTime.monthDay + ' ' + this.state.dateTime.year} 
            </Text>
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
