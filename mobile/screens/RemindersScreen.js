import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ListView,
  Picker,
  Image,
  TouchableHighlight
} from 'react-native';

import {
  ExponentLinksView,
} from '@exponent/samples';

//MobX
import mobx from 'mobx';
import { observer } from 'mobx-react/native';
import Store from '../store.js';

import axios from 'axios';

import Router from '../navigation/Router.js'

var dataSource = new ListView.DataSource({rowHasChanged: function (r1, r2) {
  return r1 !== r2
}})

var images = {
  medication: 'https://s30.postimg.org/d0nn9k64d/pill_logo1.png',
  appointment: 'https://s30.postimg.org/q3j9stwcd/appointment_logo3.jpg',
  other: 'https://s30.postimg.org/i0l3hibr1/reminder_logo.png'
}

@observer
export default class RemindersScreen extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      dataSource: dataSource.cloneWithRows(Store.reminders.map((reminder) => {
        return mobx.toJS(reminder);
      }))
    }
  }

  componentWillMount() {
    var reminders = 
    console.log(reminders)
    // this.setState({
    //   dataSource: dataSource.cloneWithRows(reminders);
    // })
  }

  static route = {
    navigationBar: {
      title: 'Reminders',
    },
  }

  _goToReminder = (reminder) => {
    Store.current = reminder;
    this.props.navigator.push(Router.getRoute('reminder'))
  }

  render() {
    return (
        <ListView
          style={styles.list}
          dataSource={this.state.dataSource}
          renderRow={(reminder) =>
            <TouchableHighlight onPress={() => this._goToReminder(reminder)}>
              <View style={styles.reminderView}> 
                <Image style={styles.reminderImage} source={{uri: images[reminder.type || 'other']}} /> 
                <Text style={styles.reminderText}>{reminder.title}</Text>
              </View>
            </TouchableHighlight> 
          }
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
        />
    );
  }
}

//{uri: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQrqidYU7IoDmubY_c9zU9pBGhfVBcJRvcaK6ghytIcCKrK-IAngQ'}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
  },
    separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
  reminderImage: {
    height: 50,
    width: 50
  },
  list: {
    backgroundColor: '#2c3e50'
  },
  reminderText: {
    color: '#ECECEC',
    alignSelf: 'center',
    paddingLeft: 20,
    fontSize: 40
  },
  reminderView: {
    flexDirection: 'row',
  }
});
