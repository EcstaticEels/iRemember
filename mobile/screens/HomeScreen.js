import React from 'react';

// import axios from 'axios';

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
} from 'react-native';

import * as Exponent from 'exponent';

import { MonoText } from '../components/StyledText';

import weatherIcons from '../assets/images/weatherIcons.js';





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

    var date = new Date();

    var weekDay = date.getDay()

    if (weekDay === 0) {
      weekDay = 'Sunday'
    }

    if (weekDay === 1) {
      weekDay = 'Monday'
    }

    if (weekDay === 2) {
      weekDay = 'Tuesday'
    }

    if (weekDay === 3) {
      weekDay = 'Wednesday'
    }

    if (weekDay === 4) {
      weekDay = 'Thursday'
    }

    if (weekDay === 5) {
      weekDay = 'Friday'
    }

    if (weekDay === 6) {
      weekDay = 'Saturday'
    }

    var month = date.getMonth();

    if (month === 0) {
      month = 'January'
    }

    if (month === 1) {
      month = 'February'
    }

    if (month === 2) {
      month = 'March'
    }

    if (month === 3) {
      month = 'April'
    }

    if (month === 4) {
      month = 'May'
    }

    if (month === 5) {
      month = 'June'
    }

    if (month === 6) {
      month = 'July'
    }

    if (month === 7) {
      month = 'August'
    }

    if (month === 8) {
      month = 'September'
    }

    if (month === 9) {
      month = 'October'
    }

    if (month === 10) {
      month = 'November'
    }

    if (month === 11) {
      month = 'December'
    }

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

            if (responseJSON.weather[0].main === 'Atmosphere') {
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

    }.bind(this))

  }

  render() {
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
//MAYBE REPLACE DEV MODE TEXT WITH TOP BAR OF KEY REMINDERS?

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
