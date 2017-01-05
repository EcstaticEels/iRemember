import React from 'react';

import {
  ScrollView,
  StyleSheet,
} from 'react-native';

import {
  ExponentConfigView,
} from '@exponent/samples';

import * as Exponent from 'exponent';

import axios from 'axios';

import Router from '../navigation/Router.js';

export default class PhotosScreen extends React.Component {
  static route = {
    navigationBar: {
      visible: false
    },
  }

  componentDidMount () {
    Exponent.ImagePicker.launchCameraAsync()
    .then((photo) => {
      console.log(photo)
      axios.post('/mobile/identify', {
        photo: photo.uri
      }) 
    })
    .then((person) => {
      this._goToPersonInfoPage(person)
    })
  }

  _goToPersonInfoPage = (person) => {
    this.props.navigator.push(Router.getRoute('person', {person: person}))
  }

  render() {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={this.props.route.getContentContainerStyle()}>

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
