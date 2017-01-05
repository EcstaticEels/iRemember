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

export default class ReminderInfoScreen extends React.Component {
  static route = {
    navigationBar: {
      title: 'Reminders'
    }
  }

  render() {
    return (
      <ScrollView contentContainerstyle={styles.contentContainer} style={styles.container}>
        <View style={styles.reminderInfoContainer}>
          <Text style={styles.reminderTitle}>{this.props.route.params.reminder.task}</Text>
        </View>
        <View style={styles.reminderInfoContainer}>
          <Text style={styles.reminderNote}>{this.props.route.params.reminder.note}</Text>
        </View>
        <View style={styles.reminderInfoContainer}>
          <Image style={styles.reminderImage} source={{uri: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQrqidYU7IoDmubY_c9zU9pBGhfVBcJRvcaK6ghytIcCKrK-IAngQ'}} /> 
        </View>
        <View style={styles.reminderInfoContainer}>
        </View>
        <View style={styles.reminderInfoContainer}>
          <Text style={styles.reminderTimeDate}>{this.props.route.params.reminder.date + ' at ' + this.props.route.params.reminder.time}</Text>       
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e50',
  },
  contentContainer: {
    paddingTop: 80
  },
  reminderInfoContainer: {
    backgroundColor: '#2c3e50',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 30
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
    alignSelf: 'center'
  },
  reminderTimeDate: {
    color: '#ECECEC',
    alignSelf: 'center',
    fontSize: 30
  },
});