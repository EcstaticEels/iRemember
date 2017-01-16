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
  View
} from 'react-native';
import * as Exponent from 'exponent';

//Server connection
import axios from 'axios';
import baseUrl from '../ip.js';

//Time helper
import moment from 'moment';

//Styling
import { MonoText } from '../components/StyledText';
import weatherIcons from '../assets/images/weatherIcons.js';

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
      }
    }
  }

  static route = {
    navigationBar: {
      visible: false,
    }
  }

  //need to render something prettier

  componentDidMount () {
    this.getTime();
    this.getWeather();
  }


  getTime() {
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
            var ind = Math.floor(weather.id/100);
            var iconKey = iconReference[ind];
            if (weather.id === 800 || weather.id === 801) {
              iconKey = iconReference[weather.id];
            }
            var description = weather.description;
            this.setState({
              weatherDescription: description.charAt(0).toUpperCase() + description.slice(1),
              weatherIcon: weatherIcons[iconKey]
            });
          })
        })
      } else {
        console.log('PLEASE ALLOW US TO USE YOUR LOCATION');
        this.setState({
          weatherDescription: 'PLEASE ALLOW US TO USE YOUR LOCATION'
        });
      }
    });
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
