//React & Exponent
import React from 'react';
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
  DeviceEventEmitter,
  ActivityIndicator
} from 'react-native';
import * as Exponent from 'exponent';

//MobX
import {observer} from 'mobx-react/native';
import Store from '../store.js'

//Server connection
import axios from 'axios';
import baseUrl from '../ip.js';

//Time helper
import moment from 'moment';

//Styling
import { MonoText } from '../components/StyledText';
import weatherIcons from '../assets/images/weatherIcons.js';

import SunCalc from 'suncalc';

import LocalNotification from '../notification/localNotification.js';
import PushNotification from '../notification/pushNotification.js';


import Router from '../navigation/Router.js';

import Alerts from '../constants/Alerts';

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
        hour: ''
      },
      loading: true
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
    this.getTime();
    this.getWeather();

    if(!this.state.notificationToken) this.allowPushNotification();
//     this.cancelDeletedReminders();
//     this.getReminders();
    // setInterval(that.getTime(), 10000);
    // const {reminders, change} = Store;
    // change('reminders', 'bye');
    // var that = this;
    this.getTime();
    this.getWeather();
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

  showPushNotification(data){
    this.props.navigator.showLocalAlert(data, Alerts.notice);
  }

  _goToReminder = (reminder) => {
    console.log('current', Store.current,'reminder', reminder)
    Store.current = reminder;
    this.props.navigator.push(Router.getRoute('reminder'))
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

  getTime() {
    var date = new Date();

    var hours = date.getHours();

    this.setState({dateTime: {
      time: moment().format('LT'),
      hour: hours
    }});
  }

  getWeather() {
    Exponent.Permissions.askAsync(Exponent.Permissions.LOCATION)
    .then((response) => {
      if (response.status === 'granted') {
        Exponent.Location.getCurrentPositionAsync()
        .then((location) => {
          this.setState({
            currentLatitude: location.coords.latitude,
            currentLongitude: location.coords.longitude
          })
          var weatherUrl = 'http://api.openweathermap.org/data/2.5/weather?' 
          weatherUrl += 'lat=' + this.state.currentLatitude + '&lon=' + this.state.currentLongitude;
          weatherUrl += '&APPID=dbab6e66b7e766cdfaf26fd6000f06e4';
          axios.get(weatherUrl)
          .then((response) => response.data.weather[0])
          .then((weather) => {
            var iconReference = {
              2: 'storm',
              3: 'rainy',
              5: 'rainy',
              6: 'snow',
              7: 'mist',
              8: 'cloudy',
              800: 'sunny',
              801: 'partiallyCloudy'

            }
            var sunlightTimes = SunCalc.getTimes(new Date(), this.state.currentLatitude, this.state.currentLongitude);
            var ind = Math.floor(weather.id/100);
            var iconKey = iconReference[ind];
            if (weather.id === 800 || weather.id === 801) {
              iconKey = iconReference[weather.id];
            }
            var description = weather.description;
            console.log(this.state.dateTime.hour)
            console.log(sunlightTimes.sunrise.getHours())
            console.log(sunlightTimes.sunset.getHours())
            if (this.state.dateTime.hour >= sunlightTimes.sunrise.getHours() && this.state.dateTime.hour <= sunlightTimes.sunset.getHours()) {
              var dayNight = 'day'
            } else {
              var dayNight = 'night'
            }

            this.setState({
              weatherDescription: description.charAt(0).toUpperCase() + description.slice(1),
              weatherIcon: weatherIcons[dayNight][iconKey],
              loading: false
            });
          })
        })
      } else {
        console.log('PLEASE ALLOW US TO USE YOUR LOCATION');
        this.setState({weatherDescription: 'PLEASE ALLOW US TO USE YOUR LOCATION'});
      }
    });
  }

  getReminders() {
    // var that = this;
    // // console.log('getting reminders', baseUrl + '/mobile/reminders')
    // axios.get(baseUrl + '/mobile/reminders', {
    //   params: {
    //     patientId: 1
    //   }
    // })
    //   .then((response) => {
    //     var reminders = response.data.reminders;
    //     that.props.updateReminders(reminders);
    //     that.setState({
    //       reminders: reminders
    //     })
    //   })
    //   .then(() => {
    //     that.pushNotification();
    //   })
    //   .catch(function (error) {
    //   //   console.log('error', error);
    //   });
  }

  render() {

    if (!this.state.loading) {
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
            <Text style={styles.dateText}>{moment().format('dddd, MMMM DD YYYY')}</Text>
          </View>

          <View style={styles.homepageContentContainer}>
            <Text style={styles.weatherText}>
              {this.state.weatherDescription}
            </Text>
            <Image style={styles.homepageContentIcon} source={{uri: "" + this.state.weatherIcon}}>
            </Image> 
          </View>

          <LocalNotification/>
          <PushNotification _goToReminder={this._goToReminder.bind(this)} showPushNotification={this.showPushNotification.bind(this)}/>
        </ScrollView>
      ) 
    } else {
      return (

        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.homepageContentContainer}>
            <Text style={styles.timeText}>
              {this.state.dateTime.time}
            </Text>
          </View>

          <View style={styles.homepageContentContainer}>
            <Text style={styles.dateText}>{moment().format('dddd, MMMM DD YYYY')}</Text>
          </View>
          <ActivityIndicator size='large' />
        </ScrollView>
      );
    }
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
  },
  activityIndicator: {
    alignSelf: 'center',
  }
});
