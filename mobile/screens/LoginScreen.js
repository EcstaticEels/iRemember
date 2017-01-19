import React from 'react';

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
  TextInput,
  Text,
  NativeModules,
  Button
} from 'react-native';

export default class LoginScreen extends React.Component {
  constructor (props) {
    super (props);

    this.state = {
      waiting: false
    }
  }

  static route = {
    navigationBar: {
      visible: false
    },
  }

  render () {
    this.props.route.params.authFunction()
      return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.promptTextContainer}>
            <Text style={styles.promptText}>
              Please enter your first name below:
            </Text>
          </View>
          <View style={styles.nameTextInputContainer}>
            <TextInput
              onSubmitEditing={this.props.route.params.handleTextSubmit}
              onChangeText={this.props.route.params.handleTextChange}
              returnKeyType={'done'}
              style={styles.nameTextInput} />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoText}> 
              To gain access to your account, you will take a photo of yourself. Please make sure that only your face is in the frame.
            </Text>
          </View>
        </ScrollView>
      )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#8bacbd',
  },
  contentContainer: {
    height: 300,
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1
  },
  nameTextInput: {
    height: 100,
    fontSize: 80,
    borderColor: '#FBFBF2',
    borderWidth: 3,
    color: '#FBFBF2',
  },
  nameTextInputContainer: {
    flex: 1,
    backgroundColor: '#8bacbd',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: 50,
    paddingLeft: 20,
    paddingRight: 20
  },
  infoText: {
    color: '#FBFBF2',
    fontFamily: 'quicksand-regular',
    textShadowColor: '#888',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 1,
    fontSize: 35,
    textAlign: 'center'
  },
  infoTextContainer: {
    backgroundColor: '#FA9581',
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 10,
    paddingTop: 10,
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
  promptText: {
    color: '#FBFBF2',
    fontFamily: 'quicksand-regular',
    textShadowColor: '#888',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 1,
    fontSize: 50,
    textAlign: 'center'
  },
  promptTextContainer: {
    backgroundColor: '#8bacbd',
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 20,
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
  activityIndicator: {
    alignSelf: 'center',
  }
});