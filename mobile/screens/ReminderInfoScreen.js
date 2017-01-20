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

import { Router } from '../navigation/Router.js';

import Exponent, {
  Components
} from 'exponent';

//MobX
import { observer } from 'mobx-react/native';
import { current } from '../store.js';

import Moment from 'moment';

import { Ionicons } from '@exponent/vector-icons';

var images = {
  Medication: 'ios-medkit',
  Appointment: 'ios-calendar',
  Chores: 'ios-home',
  Other: 'ios-alarm'
}
@observer
export default class ReminderInfoScreen extends React.Component {
  static route = {
    navigationBar: {
      title: 'Reminders'
    }
  }
  
  render() {
    var audio = <Text>''</Text>;
    if (current.audio) {
      audio = <Components.Video source={{uri: current.audio}}/>;
    }
    return (
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
          <Text style={styles.reminderTitle}>{current.title}</Text>
        {audio}
          <Text style={styles.reminderNote}>{current.note}</Text>
    
         <Ionicons size={200} color='#FBFBF2' name={images[current.type]} /> 

          <Text style={styles.reminderTimeDate}>{Moment(current.date).calendar().toString()}</Text>
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
    flex: 1,
    alignItems: 'center'
  },
  reminderInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  reminderImage: {
    height: 150,
    width: 150,
  },
  reminderTitle: {
    color: '#FBFBF2',
    fontSize: 35,
    fontFamily: 'quicksand-regular',
    textShadowColor: '#888',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 1,
  },
  reminderNote: {
    color: '#FBFBF2',
    fontSize: 20,
    fontFamily: 'quicksand-regular',
    textShadowColor: '#888',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 1,
  },
  reminderTimeDate: {
    color: '#FBFBF2',
    fontSize: 25,
    fontFamily: 'quicksand-regular',
    textShadowColor: '#888',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 1,
  }
});