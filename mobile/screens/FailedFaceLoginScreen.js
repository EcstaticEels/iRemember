import React from 'react';

import {
  ScrollView,
  StyleSheet,
  View,
  TextInput,
  Text
} from 'react-native';

import { Ionicons } from '@exponent/vector-icons';

export default class FailedLoginScreen extends React.Component {
  constructor (props) {
    super (props);
  }

  static route = {
    navigationBar: {
      title: 'Failed Login'
    },
  }

  render () {
    return (
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name='ios-lock-outline' size={300} color='#FBFBF2' />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoText}> 
              We couldn't identify you from that photo. Please try again!
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
    paddingTop: 40,
    height: 300,
    flexDirection: 'column',
    justifyContent: 'space-around',
    flex: 1
  },
  infoText: {
    fontFamily: 'quicksand-regular',
    textShadowColor: '#888',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 1,
    fontSize: 30,
    color: '#FBFBF2',
    textAlign: 'center'
  },
  iconContainer: {
    backgroundColor: '#8bacbd',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 30
  },
  infoTextContainer: {
    backgroundColor: '#8bacbd',
    flex: 1,
  },
});