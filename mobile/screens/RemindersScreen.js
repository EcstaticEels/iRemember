import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ListView,
  Picker,
  Image,
  TouchableHighlight,
  RefreshControl
} from 'react-native';

import {
  ExponentLinksView,
} from '@exponent/samples';

//MobX
import mobx from 'mobx';
import { observer } from 'mobx-react/native';
import Store from '../store.js';

import Router from '../navigation/Router.js'

import { Ionicons } from '@exponent/vector-icons';

var dataSource = new ListView.DataSource({rowHasChanged: function (r1, r2) {
  return r1 !== r2
}})

var images = {
  Medication: 'ios-medkit',
  Appointment: 'ios-calendar',
  Chores: 'ios-home',
  Other: 'ios-alarm'
}

@observer
export default class RemindersScreen extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      isRefreshing: false,
      dataSource: dataSource.cloneWithRows(Store.reminders.map((reminder) => {
        return mobx.toJS(reminder);
      }))
    }
    console.log('we are in the reminders constructor')
  }

  static route = {
    navigationBar: {
      title: 'Reminders',
    },
  }

  show(data) {
    this.props.navigator.showLocalAlert(data, Alerts.notice);
  }

  _goToReminder = (reminder) => {
    Store.current = reminder;
    this.props.navigator.push(Router.getRoute('reminder'))
  }

  _onRefresh() {
    this.setState({
      isRefreshing: true
    })
    var getReminders = Store.getReminders();
    getReminders.then((reminders)=> {
      console.log('reminders', reminders)
      var rows = dataSource.cloneWithRows(reminders)
      this.setState({
        dataSource: rows,
        isRefreshing: false
      })
    })
  }

  _onSignal() {
    var getReminders = Store.getReminders();
    getReminders.then((reminders)=> {
      var rows = dataSource.cloneWithRows(reminders)
      this.setState({
        dataSource: rows
      })
    })
    Store.update('updated', false)
  }

  render() {
    if(Store.updated){
      this._onSignal();
    }
    return (
      <View style={styles.container}>
        <ListView
          style={styles.list}
          dataSource={this.state.dataSource}
          renderRow={(reminder) =>
            <TouchableHighlight onPress={() => this._goToReminder(reminder)}>
              <View style={styles.reminderView}> 
                <Ionicons style={styles.reminderImage} name={images[reminder.type || 'Medication']} size={50} color='#FBFBF2' /> 
                <Text style={styles.reminderText}>{reminder.title}</Text>
              </View>
            </TouchableHighlight> 
          }
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
          refreshControl={
            <RefreshControl 
              refreshing={this.state.isRefreshing} 
              onRefresh={this._onRefresh.bind(this)} 
              tintColor="#ffffff"/>
          }
        />
      </View>
    );
  }
}

//{uri: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQrqidYU7IoDmubY_c9zU9pBGhfVBcJRvcaK6ghytIcCKrK-IAngQ'}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 50,
    backgroundColor: '#FA9581',
  },
    separator: {
    flex: 1,
    height: 2,
    backgroundColor: '#777',
  },
  reminderImage: {
    height: 50,
  },
  list: {
    backgroundColor: '#8bacbd',
  },
  reminderText: {
    color: '#FBFBF2',
    alignSelf: 'center',
    // paddingLeft: 20,
    fontSize: 30,
    fontFamily: 'quicksand-regular',
    textShadowColor: '#888',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 1,
    paddingLeft: 20,
    paddingRight: 20
  },
  reminderView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 100,
    paddingLeft: 10,
    paddingRight: 10,
  },
});
