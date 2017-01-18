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
        <View style={styles.personInfoContainer}>
          <Text style={styles.personName}>{this.props.route.params.person.name}</Text>
        </View>
        {audio}
        <View style={styles.personInfoContainer}>
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
    backgroundColor: '#2c3e50',
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
    alignItems: 'center'
  },
  personImage: {
    height: 200,
    width: 200,
  },
  personName: {
    color: '#ECECEC',
    fontSize: 50,
    textDecorationLine: 'underline',
    textDecorationColor: '#ECECEC'
  },
  personInfo: {
    color: '#ECECEC',
    fontSize: 30,
  }
});