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

import Moment from 'moment'

var images = {
  medication: 'https://s30.postimg.org/d0nn9k64d/pill_logo1.png',
  appointment: 'https://s30.postimg.org/q3j9stwcd/appointment_logo3.jpg',
  other: 'https://s30.postimg.org/i0l3hibr1/reminder_logo.png'
}

export default class ReminderInfoScreen extends React.Component {
  static route = {
    navigationBar: {
      title: 'Reminders'
    }
  }
  
  render() {
    console.log(this.props.route.params.reminder.date + ' at ' + this.props.route.params.reminder.time)
    var audio = <Text>''</Text>;
    if (this.props.route.params.reminder.audio) {
      audio = <Components.Video source={{uri: this.props.route.params.reminder.audio}}/>;
    }
    return (
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        <View style={styles.reminderInfoContainer}>
          <Text style={styles.reminderTitle}>{this.props.route.params.reminder.title}</Text>
        </View>
        {audio}
        <View style={styles.reminderInfoContainer}>
          <Text style={styles.reminderNote}>{this.props.route.params.reminder.note}</Text>
        </View>
        <View style={styles.reminderInfoContainer}>
          <Image style={styles.reminderImage} source={{uri: images[this.props.route.params.reminder.type || 'other']}} /> 
        </View>
        <View style={styles.reminderInfoContainer}>
          <Text style={styles.reminderTimeDate}>{Moment(this.props.route.params.reminder.date).calendar().toString()}</Text>       
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
    color: '#ECECEC',
    fontSize: 40,
    textDecorationLine: 'underline',
    textDecorationColor: '#ECECEC'
  },
  reminderNote: {
    color: '#ECECEC',
    fontSize: 20,
  },
  reminderTimeDate: {
    color: '#ECECEC',
    fontSize: 30
  }
});