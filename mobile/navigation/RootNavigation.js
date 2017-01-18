//React & Exponent
import React from 'react';
import {
  StyleSheet,
  View,
  NativeModules,
  StatusBar
} from 'react-native';
import {ImagePicker, TouchID} from 'exponent';
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

// import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';

import baseUrl from '../ip.js';

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

componentWillMount() {
  StatusBar.setHidden(true);
}

  uploadImageAsync(uri) {
    console.log(this.state)
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

    console.log('UPLOADING IMAGE')

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
      this.setState({loading: true}, function () {
        this.uploadImageAsync(photo.uri)
        .then((person) => {
          console.log(person)
          return person.json()
          .then((person) => {
            console.log(person)
            if (person.name === this.state.name) {
              this.setState({authenticated: true, id: person.id, loading:false})
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
    })
  }  

  authFunction () {
    NativeModules.ExponentFingerprint.authenticateAsync('Show me your finger!')
    .then((result) => {
      console.log(result)
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
            <StackNavigation 
            defaultRouteConfig={{
              navigationBar: {
                backgroundColor: '#FF8A9C',
                titleStyle: {
                  // color: '#FBFBF2',
                  fontFamily: 'quicksand-regular',
                  fontSize: 30,
                },
                tintColor: '#FBFBF2'
              }
            }} 
            initialRoute={Router.getRoute('home', {state: this.state})}/>
          </TabNavigationItem>
          <TabNavigationItem
            id="reminders"
            style={styles.tabItem}
            renderIcon={isSelected => this._renderIcon('bell', isSelected)}>
            <StackNavigation
            defaultRouteConfig={{
              navigationBar: {
                backgroundColor: '#FF8A9C',
                titleStyle: {
                  // color: '#FBFBF2',
                  fontFamily: 'quicksand-regular',
                  fontSize: 30,
                },
                tintColor: '#FBFBF2'
              }
            }} 
            initialRoute={Router.getRoute('reminders', {state: this.state})}/>
          </TabNavigationItem>

          <TabNavigationItem
            id="photos"
            style={styles.tabItem}
            renderIcon={isSelected => this._renderIcon('camera', isSelected)}>
            <StackNavigation 
            defaultRouteConfig={{
              navigationBar: {
                backgroundColor: '#FF8A9C',
                titleStyle: {
                  // color: '#FBFBF2',
                  fontFamily: 'quicksand-regular',
                  fontSize: 30,
                },
                tintColor: '#FBFBF2'
              }
            }} 
            initialRoute={Router.getRoute('photos', {state: this.state})}/>
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
  },
});
