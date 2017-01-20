import React from 'react';

import {
  TouchableHighlight,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Exponent, {
  Components
} from 'exponent';

import { Router } from '../navigation/Router.js';

export default class PersonInfoScreen extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      played: false
    }
  }
  static route = {
    navigationBar: {
      visible: false
    }
  }

  render() {
    console.log('on personinfo screen', this.props.route.params)
    var audio = <Text></Text>;
    if (this.props.route.params.person.audio && !this.state.played) {
      audio = 
        <Components.Video
        source={{uri: this.props.route.params.person.audio}}
        />;
    }

    return (
      <ScrollView contentContainerStyle={styles.contentContainer} style={styles.container}>
        <View style={styles.personNameContainer}>
          <Text style={styles.personName}>{this.props.route.params.person.name}</Text>
        </View>
        {audio}
        <View style={styles.photoContainer}>
          <Image style={styles.personImage} source={{uri: this.props.route.params.person.photo}} /> 
        </View>
        <View style={styles.personInfoContainer}>
          <Text style={styles.personInfo}>{this.props.route.params.person.description}</Text>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#8bacbd',
  },
  contentContainer: {
    height: 300,
    flexDirection: 'column',
    justifyContent: 'space-around',
    flex: 1
  },
  personInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1
  },
  personNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FA9581',
    flex: 1
  },
  photoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 4
  },
  personImage: {
    height: 300,
    width: 300,
  },
  personName: {
    color: '#FBFBF2',
    fontSize: 60,
    fontFamily: 'quicksand-regular',
    textShadowColor: '#888',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 1,
  },
  personInfo: {
    color: '#FBFBF2',
    fontSize: 25,
    fontFamily: 'quicksand-regular',
    textShadowColor: '#888',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 1,
  }
});