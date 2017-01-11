import React from 'react';

import {
  ScrollView,
  StyleSheet,
  View,
  TextInput,
  Text
} from 'react-native';

import * as Exponent from 'exponent';

import ipAdress from '../ip.js';

var baseUrl = 'http://' + ipAdress;

export default class LoginScreen extends React.Component {
  constructor (props) {
    super (props);

    console.log(this.props.route.params)
  }

  static route = {
    navigationBar: {
      visible: false
    },
  }

  render () {
    return (
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
          <TextInput
            // onSubmitEditing={this.props.handleTextSubmit}
            onChangeText={this.props.route.params.handleTextChange}
            placeholder={'Enter your first name here'}
            placeholderTextColor={'#95a5a6'}
            style={styles.nameTextInput} />
          <Text style={styles.infoText}> 
            On the next screen, you will take a photo of yourself. Please make sure that only your face is in the photo
          </Text>
      </ScrollView>
    )
  }
}

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
  nameTextInput: {
    height: 40,
    fontSize: 36,
    borderColor: 'gray',
    borderWidth: 1,
    color: '#ECECEC',
  },
  infoText: {
    color: '#ECECEC',
    fontSize: 24,
    alignSelf: 'center'
  }
});