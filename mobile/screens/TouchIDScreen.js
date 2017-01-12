import React from 'react';

import {
  ActivityIndicator,
  Alert,
  Animated,
  AppState,
  DeviceEventEmitter,
  Image,
  ListView,
  NativeModules,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Exponent, {
  Components,
  Constants,
  Contacts,
  Font,
  Location,
  Notifications,
  Permissions,
} from 'exponent';

import Colors from '../constants/Colors'

export default class TouchIDExample extends React.Component {
  state = {
    waiting: false,
  }

  render() {

    let authFunction;      

    authFunction = async () => {
      let result = await NativeModules.ExponentFingerprint.authenticateAsync('Show me your finger!');
      // NativeModules.ExponentFingerprint.authenticateAsync('Show me your finger!')
      if (result.success) {
        alert('Success!');
      } else {
        alert('Cancel!');
      }
    }

    return (
      <View style={{paddingTop: 100}}>
        <Button onPress={authFunction}>
          { this.state.waiting ? 'Waiting for fingerprint... ' : 'Authenticate with fingerprint' }
        </Button>
      </View>
    );
  }
}


function Button(props) {
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.button}>
      <Text style={styles.buttonText}>{props.children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
  },
  sectionHeader: {
    backgroundColor: 'rgba(245,245,245,1)',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 3,
    backgroundColor: Colors.tintColor,
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
  },
});