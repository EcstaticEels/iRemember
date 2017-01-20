import React from 'react';

import {
  ScrollView,
  StyleSheet,
  View,
  TextInput,
  Text
} from 'react-native';

import { Ionicons } from '@exponent/vector-icons';

export default class NoFaceFoundScreen extends React.Component {
  constructor (props) {
    super (props);

    console.log(this.props.route.params)
  }

  static route = {
    navigationBar: {
      title: 'No Face Found'
    },
  }

  render () {
    return (
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name='help' size={300} color='#FBFBF2' />
          </View>
          <View style={styles.infoTextContainer}> 
            <Text style={styles.infoText}> 
              We didn't find any faces in that photo. Please make sure the face is in frame and try again!
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
    fontSize: 36,
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