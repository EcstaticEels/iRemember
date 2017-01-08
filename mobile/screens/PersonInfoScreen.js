import React from 'react';

import {
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
  static route = {
    navigationBar: {
      visible: false
    }
  }

  render() {
    console.log('on personinfo screen', this.props.route.params)
    var audio = <Text>''</Text>;
    if (this.props.route.params.person.audio) {
      audio = <Components.Video source={{uri: this.props.route.params.person.audio}}/>;
    }
    return (
      <ScrollView contentContainerstyle={styles.contentContainer} style={styles.container}>
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
    paddingTop: 40,
    height: 300,
    flexDirection: 'column',
    justifyContent: 'space-around',
    flex: 1
  },
  personInfoContainer: {
    backgroundColor: '#2c3e50',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  personImage: {
    height: 150,
    width: 150,
  },
  personName: {
    color: '#ECECEC',
    fontSize: 40,
    textDecorationLine: 'underline',
    textDecorationColor: '#ECECEC'
  },
  personInfo: {
    color: '#ECECEC',
    fontSize: 20,
  },
});