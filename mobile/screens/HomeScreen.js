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

import * as Exponent from 'exponent'

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

            if (responseJSON.weather[0].description === 'few clouds') {
              this.setState({
                weatherDescription: responseJSON.weather[0].description,
                weatherIcon: weatherIcons.partiallyCloudy
              })
            }

            if (responseJSON.weather[0].description === 'scattered clouds' || responseJSON.weather[0].description === 'broken clouds' || responseJSON.weather[0].description === 'overcast clouds') {
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

  // test() {
  //   axios.post('http://10.6.19.25:3000/mobile/identify', {
  //     firstName: 'Fred',
  //     lastName: 'Flintstone'
  //   })
  //     .then(function (response) {
  //       console.log(response);
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });

  //   // console.log('Hiiii')
  //   // var data = 'Hi'
  //   // fetch ('http://10.6.19.25:3000/mobile/reminders', {
  //   //   method: 'GET',
  //   //   data: data,
  //   //   body: data,
  //   //   json: data, 
  //   //   headers: new Headers({
  //   //     'Content-Type': 'application/json'
  //   //   })
  //   // })
  //   //   .then(function (response) {
  //   //     return response.json()
  //   //   })
  //   //   .then(function (responseJSON) {
  //   //     console.log(responseJSON);
  //   //   })
  //   //   .catch(function (err) {
  //   //     console.log(err)
  //   //   })
  // }

  render() {
    return (
      <View style={styles.container}>

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

          <View style={styles.weatherContainer}>
            <Text style={styles.weatherText}>
              {this.state.weatherDescription}
            </Text>
            <Image style={styles.homepageContentIcon} source={{uri: "" + this.state.weatherIcon}}>
            </Image> 
          </View>

        </ScrollView>

      </View>
    );
  }
}

//WOULD STILL LIKE TO RENDER DIFFERENT COLOR SCHEME BASED ON DAY VS. NIGHT
//MAYBE REPLACE DEV MODE TEXT WITH TOP BAR OF KEY REMINDERS?

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e50',
  },
  contentContainer: {
    paddingTop: 80,
  },
  homepageContentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 30
  },
  homepageContentIcon: {
    // flex: 1,
    height: 100,
    width: 100
  },
  weatherContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 30,
    paddingTop: 30

  },
  weatherText: {
    color: '#ECECEC',
    // flex: 1,
    fontSize: 24
  },
  timeText: {
    fontSize: 48, 
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
