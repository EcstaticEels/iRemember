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

export default class RemindersScreen extends React.Component {

  constructor () {
    super ();

    var dataSource = new ListView.DataSource({rowHasChanged: function (r1, r2) {
      return r1 !== r2
    }})

    this.state = {
      upcomingReminders: [],
      completedReminders: [],
      dataSource: dataSource.cloneWithRows(['rem1', 'rem2']),
    }
  }

  static route = {
    navigationBar: {
      title: 'Links',
    },
  }

  render() {
    return (

        <ListView
          style={styles.list}
          dataSource={this.state.dataSource}
          renderRow={(rowData) =>
            <View>
              <Image style={styles.reminderImage} source={{uri: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQrqidYU7IoDmubY_c9zU9pBGhfVBcJRvcaK6ghytIcCKrK-IAngQ'}} /> 
              <Text style={styles.reminderText}>{rowData}</Text>
            </View> 
          }
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
          renderHeader={() => 
            <View> 
              <Text>
                {'Reminders'}
              </Text> 
            </View>
          }
        />
    );
  }

}

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
    color: '#ECECEC'
  }
});
