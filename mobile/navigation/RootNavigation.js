import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import {Notifications, ImagePicker, TouchID} from 'exponent';
import {
  StackNavigation,
  TabNavigation,
  TabNavigationItem,
} from '@exponent/ex-navigation';
import {
  FontAwesome,
} from '@exponent/vector-icons';

import Router from './Router.js';
import Alerts from '../constants/Alerts';
import Colors from '../constants/Colors';
import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';

import ipAdress from '../ip.js';

var baseUrl = 'http://' + ipAdress;

export default class RootNavigation extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      reminders: [],
      authenticated: false,
      name: ''
    }

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleTextSubmit = this.handleTextSubmit.bind(this);

  }

  componentDidMount() {
    this._notificationSubscription = this._registerForPushNotifications();
  }

  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove();
  }

  updateReminders (reminders) {
    this.setState({
      reminders: reminders
    })
  }

  uploadImageAsync(uri) {
    let date = Date.now();
    let apiUrl = `${baseUrl}/mobile/login?date=${date}`
    console.log(apiUrl)

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
    console.log(text)
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
        console.log(person)
        return person.json()
        .then((person) => {
          console.log(person)
          if (person.name === this.state.name) {
            this.setState({authenticated: true})
          } else {
            this._failedLogin()
          }
        })
      })
      .catch((err) => {
        console.log('BRO WE CANT AUTHENTICATE U')
        console.log('ERROR', err)
        this._failedLogin()
      })
    })
  }

  render() {

    // if (!this.state.authenticated) {
    //   return (
    //     <StackNavigation
    //       initialRoute={Router.getRoute('login', {handleTextChange: this.handleTextChange, handleTextSubmit: this.handleTextSubmit})}/>
    //       // initialRoute='login' />
    //   )
    // } else {
      return (
        <TabNavigation
          id="main"
          navigatorUID="main"
          tabBarHeight={200}
          initialTab="home">
          <TabNavigationItem
            id="home"
            renderIcon={isSelected => this._renderIcon('home', isSelected)}>
            <StackNavigation initialRoute={Router.getRoute('home', {reminders: this.state.reminders, updateReminders:this.updateReminders.bind(this)})}/>
          </TabNavigationItem>

          <TabNavigationItem
            id="reminders"
            renderIcon={isSelected => this._renderIcon('bell', isSelected)}>
            <StackNavigation initialRoute={Router.getRoute('reminders', {reminders: this.state.reminders})} />
          </TabNavigationItem>

          <TabNavigationItem
            id="photos"
            renderIcon={isSelected => this._renderIcon('camera', isSelected)}>
            <StackNavigation initialRoute="photos" />
          </TabNavigationItem>
        </TabNavigation>
      );

    // }
  }

  _renderIcon(name, isSelected) {
    return (
      <FontAwesome
        name={name}
        size={100}
        color={isSelected ? Colors.tabIconSelected : Colors.tabIconDefault}
      />
    );
  }

  _registerForPushNotifications() {
  //   // Send our push token over to our backend so we can receive notifications
  //   // You can comment the following line out if you want to stop receiving
  //   // a notification every time you open the app. Check out the source
  //   // for this function in api/registerForPushNotificationsAsync.js
  //   registerForPushNotificationsAsync();

  //   // Watch for incoming notifications
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  _handleNotification = ({origin, data}) => {
    if(origin === 'received') {
      var title = Object.getOwnPropertyNames(data);
      this.props.navigator.showLocalAlert(
        title + ' : ' + data[title],
        Alerts.notice
      );
    } else {

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
  },
});
